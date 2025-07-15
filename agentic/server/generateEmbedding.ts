"use server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateEmbedding(text: string, timeoutMs: number = 3000): Promise<number[] | null> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    }, { signal: controller.signal })
    
    clearTimeout(timeoutId)
    return response.data[0].embedding
  } catch (error) {
    clearTimeout(timeoutId)
    console.error('Error generating embedding:', error)
    return null
  }
}