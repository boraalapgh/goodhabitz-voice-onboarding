'use client'

import React, { useRef } from 'react'
import { Waveform } from '../Waveform'
import { Upload, X } from 'lucide-react'
import { RealtimeItem } from '@openai/agents/realtime'
import { Button } from '../ui/button'
import { Message } from '../Message'


interface VoiceInterfaceProps {
  history: RealtimeItem[]
  onClose: () => void
  isVoiceMode: boolean
  onFileUpload?: (file: File) => void
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  history,
  onClose,
  isVoiceMode,
  onFileUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getMessageText = (item: any) => {
    
    
    return {
        id: item.itemId,
        role: item.role,
        content: item.content[0]?.transcript || "",
        isVoice: item.type === 'audio' || item.type === 'input_audio',
        timestamp: new Date() 
    }
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onFileUpload) {
      onFileUpload(file)
      // Reset input value to allow uploading the same file again
      event.target.value = ''
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat history */}
      {/* <div className="overflow-y-auto p-4 space-y-4 flex-1 flex-grow h-full">
        {history.map((item) => (
          <Message message={getMessageText(item)} key={item.itemId} />
        ))}
      </div> */}
<div className="overflow-y-auto p-4 space-y-4 flex-1 flex-grow h-full">
{isVoiceMode && (
          <div className="flex flex-col items-center gap-4">
            <div className="">
              <Waveform />
            </div>
          </div>
        )}
    </div>

      <div className="flex flex-row items-center justify-center gap-4 p-8 w-full bg-gray-100">
        {/* Attach a file to the chat */}
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

        {/* Waveform for active recording */}
       

        {/* End Chat Button */}
        <button
          onClick={onClose}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-md focus:ring-2 focus:ring-teal-400 transition-colors"
        >
          {isVoiceMode ? "End Voice Chat" : history.length === 0 ? "Start Voice Chat" : "Continue Voice Chat"}
        </button>
      </div>
    </div>
  )
}
