import React from 'react'
import { Card, CardContent } from './ui/card'
import { ChatMessage } from '@/types'
import { Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { AgentInputItem } from '@openai/agents';



export const Message = ({ message }: { message: AgentInputItem }) => {
  if ('type' in message && (message.type === 'hosted_tool_call' || message.type === 'function_call' || message.type === 'computer_call')) {
    return (
      <div>
        <p>Tool call</p>
      </div>
    )
  }

  if (!('role' in message) || !('content' in message)) {
    return null;
  }

  const isUser = message.role === 'user'
  
  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
        }`}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        <Card className={`${isUser ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
          <CardContent className="p-3">
            {Array.isArray(message.content) ? message.content.map((content: any, index: number) => {
							
							return (
              <p key={index} className="text-sm whitespace-pre-wrap">
                {content.type === 'input_text' || content.type === 'output_text' ? content.text : ''}
              </p>
            )}) : (
              <p className="text-sm whitespace-pre-wrap">{String(message.content)}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}