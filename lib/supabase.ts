import { createClient } from '@supabase/supabase-js'
import { Company, User, Course, EventLog } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: Company
        Insert: Omit<Company, 'id' | 'created_at'>
        Update: Partial<Omit<Company, 'id' | 'created_at'>>
      }
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at'>
        Update: Partial<Omit<User, 'id' | 'created_at'>>
      }
      courses: {
        Row: Course
        Insert: Omit<Course, 'id' | 'created_at'>
        Update: Partial<Omit<Course, 'id' | 'created_at'>>
      }
      event_logs: {
        Row: EventLog
        Insert: Omit<EventLog, 'id' | 'created_at'>
        Update: Partial<Omit<EventLog, 'id' | 'created_at'>>
      }
    }
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Helper functions for data access
export const getUser = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*, companies(*)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export const getCourses = async (filters?: { skills?: string[], timeAvailable?: string, contentType?: string }) => {
  let query = supabase
    .from('contents')
    .select('*, content_skills(skill_id, skills(name))').limit(3)

  if (filters?.skills && filters.skills.length > 0) {
    query = query.contains('content_skills.skill.name', filters.skills)
  }

  if (filters?.timeAvailable) {
    query = query.eq('duration', filters.timeAvailable)
  }

  if (filters?.contentType) {
    query = query.eq('kind', filters.contentType)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export const logEvent = async (userId: string, event: string, payload: Record<string, any>) => {
  const { error } = await supabase
    .from('event_logs')
    .insert({
      user_id: userId,
      event,
      payload,
    })

  if (error) throw error
} 