'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

import { useChatContext } from '../contexts/ChatContext'
import { Message } from '../Message'
import { runTextAgent } from '@/agentic/agents/text'
import { uploadFileToVectorStore } from '@/agentic/server/vectorStore'
import { AgentInputItem } from '@openai/agents'
import { AgentResponseWithSuggestions } from '@/types'
import { AISuggestion } from '@/components/ui/ai-suggestion'


export const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('')
  

  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { messages, isLoading, addMessage, setIsLoading, setRecommendedCourses, suggestions, setSuggestions } = useChatContext()


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Add new effect for initial focus
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Shared function to process agent responses
  const processAgentResponse = (result: any[]) => {
    result.forEach((item: any) => {
      if (item.type === "function_call_result") {
        console.log("result.output", item.output);
        
        try {
          const coursesData = typeof item.output.text === 'string' ? JSON.parse(item.output.text) : item.output.text;
          console.log("coursesData", coursesData);
          
          setRecommendedCourses(coursesData.contents || []);
        } catch (e) {
          console.error('Error parsing courses data:', e);
        }
      }
      
      if (item.type === 'message') {
        // Check if the message content contains JSON with suggestions
        if (item.content && item.content[0] && item.content[0].type === 'output_text') {
          const messageText = item.content[0].text
          
          try {
            // Try to parse as JSON
            const parsed: AgentResponseWithSuggestions = JSON.parse(messageText)
            if (parsed.content && parsed.suggestions) {
              // Update the message content to just the text
              const updatedItem = {
                ...item,
                content: [{
                  type: 'output_text' as const,
                  text: parsed.content
                }]
              }
              addMessage(updatedItem)
              setSuggestions(parsed.suggestions)
              return
            }
          } catch {
            // If parsing fails, it's just regular text - clear suggestions
            setSuggestions([])
          }
        }
        
        addMessage(item)
        setSuggestions([]) // Clear suggestions for regular messages
      }
    })
  }

  // Shared function to send message to agent
  const sendToAgent = async (message: AgentInputItem) => {
    if (isLoading) return

    // Add message to chat
    addMessage(message)

    // Set loading state
    setIsLoading(true)

    try {
      // Call the agent
      const result = await runTextAgent([...messages, message])
      console.log('Agent result:', result)

      processAgentResponse(result)
    } catch (error) {
      console.error('Error:', error)
      // Add error message
      addMessage({
        role: 'assistant' as const,
        type: 'message',
        status: 'completed',
        content: [{ 
          type: 'output_text' as const, 
          text: 'Sorry, I encountered an error. Please try again.' 
        }],
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return

    const userMessage: AgentInputItem = {
      role: 'user' as const,
      type: 'message',
      content: [{ type: 'input_text' as const, text }],
    }

    // Clear input and refocus
    setInput('')
    textareaRef.current?.focus()
    
    // Clear suggestions when user sends a message
    setSuggestions([])

    await sendToAgent(userMessage)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSubmit(suggestion)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(input)
    }
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
      // Reset input value to allow uploading the same file again
      event.target.value = ''
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      // Upload file to vector store
      const formData = new FormData()
      formData.append('file', file)
      
      const { fileId } = await uploadFileToVectorStore(formData)
      
      // Create message with file reference
      const fileMessage: AgentInputItem = {
        role: 'user' as const,
        content: [
          {
            type: 'input_file' as const,
            file: { id: fileId }
          },
          {
            type: 'input_text' as const,
            text: `I've uploaded a file: ${file.name} (${file.type}, ${Math.round(file.size / 1024)}KB). Please analyze this file and provide relevant course recommendations based on its content.`
          }
        ],
      }

      await sendToAgent(fileMessage)
    } catch (error) {
      console.error('Error processing file:', error)
      // Add error message for file processing issues
      addMessage({
        role: 'assistant' as const,
        type: 'message',
        status: 'completed',
        content: [{ 
          type: 'output_text' as const, 
          text: 'Sorry, I had trouble uploading your file. Please try again or describe your needs in text.' 
        }],
      })
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="overflow-y-auto p-4 space-y-4 flex-1 flex-grow h-full">
        {messages.map((message) => (
          <Message message={message} key={message.id} />
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-3 max-w-[80%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <Card className="bg-card">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t bg-gray-100 p-4">
        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-3">
            <AISuggestion 
              suggestions={suggestions} 
              onSuggestionClick={handleSuggestionClick}
              className="bg-white rounded-lg border p-2"
            />
          </div>
        )}
        
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="resize-none"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <Button variant="outline" onClick={handleFileClick} className="relative">
            <Upload className="h-4 w-4" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="pdf, docx, doc, txt"
            />
          </Button>

          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
} 