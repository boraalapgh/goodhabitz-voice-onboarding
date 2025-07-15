
import { tool } from '@openai/agents'
import { z } from 'zod'
import { supabase } from '@/lib/supabaseClient'
import { generateEmbedding } from '../server/generateEmbedding'




interface ContentResult {
  id: string
  title: string
  type: 'course' | 'lesson' | 'activity'
  content_skills: any[]
  duration: number
  description: string
  difficulty: string
}

interface FetchContentResult {
  ids: string[]
  contents?: ContentResult[]
}

// Helper function to generate embeddings with timeout


// Helper function to log unknown skills
async function logUnknownSkill(skill: string) {
  try {
    await supabase
      .from('event_logs')
      .insert({
        event: 'unknown_skill',
        payload: { skill, timestamp: new Date().toISOString() },
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Error logging unknown skill:', error)
  }
}

// Step 1: Exact match against content skills
async function exactMatch(skills: string[], timeoutMs: number = 500): Promise<string[]> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  
  try {
    const { data, error } = await supabase
      .from('contents')
      .select(`
        id,
        content_skills!inner (
          skills!inner (
            name
          )
        )
      `)
      .in('content_skills.skills.name', skills)
      .limit(10)
    
    clearTimeout(timeoutId)
    
    if (error) {
      console.error('Error in exact match:', error)
      return []
    }
    
    return data?.map(item => item.id) || []
  } catch (error) {
    clearTimeout(timeoutId)
    console.error('Exact match timeout or error:', error)
    return []
  }
}

// Step 2: Alias mapping to canonical skills
async function aliasMatch(skills: string[], timeoutMs: number = 500): Promise<string[]> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  
  try {
    // First, get canonical skills from aliases
    const { data: aliasData, error: aliasError } = await supabase
      .from('skill_aliases')
      .select(`
        skill_id,
        skills!inner (
          name
        )
      `)
      .in('alias', skills)
    
    if (aliasError || !aliasData?.length) {
      clearTimeout(timeoutId)
      return []
    }
    
    const canonicalSkills = aliasData.map((item: any) => item.skills.name)
    
    // Then find content with those canonical skills
    const { data: contentData, error: contentError } = await supabase
      .from('contents')
      .select(`
        id,
        content_skills!inner (
          skills!inner (
            name
          )
        )
      `)
      .in('content_skills.skills.name', canonicalSkills)
      .limit(10)
    
    clearTimeout(timeoutId)
    
    if (contentError) {
      console.error('Error in alias match:', contentError)
      return []
    }
    
    return contentData?.map(item => item.id) || []
  } catch (error) {
    clearTimeout(timeoutId)
    console.error('Alias match timeout or error:', error)
    return []
  }
}

// Step 3: Semantic search using embeddings
async function semanticSearch(skills: string[], timeoutMs: number = 3000): Promise<string[]> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  
  try {
    // Generate embedding for the combined skills
    const searchText = skills.join(' ')
    const embedding = await generateEmbedding(searchText, timeoutMs - 500) // Leave some time for the query
    
    if (!embedding) {
      clearTimeout(timeoutId)
      return []
    }
    
    // Perform similarity search
    const { data, error } = await supabase.rpc('match_contents', {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: 3
    })
    
    clearTimeout(timeoutId)
    
    if (error) {
      console.error('Error in semantic search:', error)
      return []
    }
    
    return data?.map((item: any) => item.id) || []
  } catch (error) {
    clearTimeout(timeoutId)
    console.error('Semantic search timeout or error:', error)
    return []
  }
}

// Helper function to get content details
async function getContentDetails(ids: string[]): Promise<ContentResult[]> {
  if (!ids.length) return []
  
  try {
    const { data, error } = await supabase
      .from('contents')
      .select(`
        id,
        title,
        kind,
        description,
        difficulty,
        duration,
        content_skills (
          skills (
            name
          )
        )
      `)
      .in('id', ids)
    
    if (error) {
      console.error('Error fetching content details:', error)
      return []
    }
    
    return data?.map(item => ({
      id: item.id,
      title: item.title,
      type: item.kind as 'course' | 'lesson' | 'activity',
      content_skills: item.content_skills,
      duration: item.duration || 0,
      description: item.description || '',
      difficulty: item.difficulty || ''
    })) || []
  } catch (error) {
    console.error('Error getting content details:', error)
    return []
  }
}

// Helper function that implements the core logic for both tools
export async function fetchContentBySkillsCore(skills: string[], includeDetails: boolean = false): Promise<string> {
  const startTime = Date.now()
  const maxExecutionTime = 5000 // 5 seconds total limit
  
  try {
    let foundIds: string[] = []
    const unknownSkills: string[] = []
    
    // Step 1: Exact match (500ms timeout)
    console.log('Step 1: Exact match for skills:', skills)
    const exactIds = await exactMatch(skills, 500)
    foundIds = [...exactIds]
    
    // Step 2: Alias mapping if no exact matches (500ms timeout)
    if (foundIds.length === 0 && Date.now() - startTime < maxExecutionTime - 1000) {
      console.log('Step 2: Alias mapping for skills:', skills)
      const aliasIds = await aliasMatch(skills, 500)
      foundIds = [...aliasIds]
    }
    
    // Step 3: Semantic search if still no matches (remaining time)
    if (foundIds.length === 0 && Date.now() - startTime < maxExecutionTime - 500) {
      console.log('Step 3: Semantic search for skills:', skills)
      const remainingTime = maxExecutionTime - (Date.now() - startTime)
      const semanticIds = await semanticSearch(skills, Math.max(3000, remainingTime))
      foundIds = [...semanticIds]
    }
    
    // Log unknown skills and try fallback
    if (foundIds.length === 0) {
      console.log('No specific matches found, trying fallback courses')
      for (const skill of skills) {
        unknownSkills.push(skill)
        await logUnknownSkill(skill)
      }
      
      // Fallback: return some popular courses if no matches found
      try {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('contents')
          .select('id')
          .eq('kind', 'course')
          .limit(3)
        
        if (!fallbackError && fallbackData?.length) {
          foundIds = fallbackData.map(item => item.id)
        }
      } catch (error) {
        console.error('Fallback query failed:', error)
      }
    }
    
    // Deduplicate and limit to 3
    const uniqueIds = Array.from(new Set(foundIds)).slice(0, 3)
    
    const result: FetchContentResult = {
      ids: uniqueIds
    }
    
    // Include content details if requested
    if (includeDetails && uniqueIds.length > 0) {
      result.contents = await getContentDetails(uniqueIds)
    }
    
    const executionTime = Date.now() - startTime
    console.log(`fetchContentBySkills completed in ${executionTime}ms, found ${uniqueIds.length} results`)
    
    return JSON.stringify(result)
  } catch (error) {
    console.error('Error in fetchContentBySkills:', error)
    return JSON.stringify({ 
      ids: [], 
      error: 'Failed to fetch content suggestions' 
    })
  }
}



// Legacy filterCourses tool for backwards compatibility
export const filterCourses = tool({
  name: 'filterCourses',
  description: 'Filter courses based on user preferences. Returns up to 3 most relevant courses.',
  parameters: z.object({
    skills: z.array(z.string()).describe('Skills the user wants to develop'),
    timeAvailable: z.enum(['short', 'medium', 'long']).describe('How much time they want to spend'),
    contentType: z.enum(['course', 'lesson', 'activity', 'any']).describe('Type of content they prefer')
  }),
  async execute({ skills, timeAvailable, contentType }) {
    // Use the core helper function
    const result = JSON.parse(await fetchContentBySkillsCore(skills, true))
    
    if (result.contents) {
      // Filter by content type if specified
      let filteredContents = result.contents
      if (contentType !== 'any') {
        filteredContents = result.contents.filter((content: ContentResult) => content.type === contentType)
      }
      
      // Filter by time available
      if (timeAvailable === 'short') {
        filteredContents = filteredContents.filter((content: ContentResult) => content.duration <= 30)
      } else if (timeAvailable === 'medium') {
        filteredContents = filteredContents.filter((content: ContentResult) => content.duration > 30 && content.duration <= 120)
      } else if (timeAvailable === 'long') {
        filteredContents = filteredContents.filter((content: ContentResult) => content.duration > 120)
      }
      
      return JSON.stringify(filteredContents.slice(0, 3))
    }
    
    return JSON.stringify([])
  }
}) 