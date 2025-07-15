"use server"

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// You'll need to create this vector store manually in OpenAI dashboard
// and replace this with your actual vector store ID
const VECTOR_STORE_ID = process.env.OPENAI_VECTOR_STORE_ID!

export async function uploadFileToVectorStore(formData: FormData): Promise<{ fileId: string; vectorStoreId: string }> {
  try {
    const file = formData.get('file') as File

    if (!file) {
      throw new Error('No file provided')
    }

    // Upload file to OpenAI
    const uploadedFile = await openai.files.create({
      file: file,
      purpose: 'assistants',
    })

    console.log('Uploaded file:', uploadedFile.id, 'to vector store:', VECTOR_STORE_ID)

    return {
      fileId: uploadedFile.id,
      vectorStoreId: VECTOR_STORE_ID
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('Failed to upload file')
  }
}

