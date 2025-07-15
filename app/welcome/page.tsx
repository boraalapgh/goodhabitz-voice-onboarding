'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatProvider } from '@/components/contexts/ChatContext'
import { CourseBar } from '@/components/onboarding/CourseBar'
import { GoodHabitzLogo } from '@/components/ui/logo'
import { getUser } from '@/lib/supabase'
import { User, Company } from '@/types'
import { ChatBox } from '@/components/ChatBox'


const loadingMessages = [
  'Fetching your data...',
  'Setting a nice table to talk about your goals...',
  "Let's start the conversation!"
]

export default function WelcomePage() {
  const searchParams = useSearchParams()
  const [user, setUser] = useState<(User & { companies: Company }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [showChat, setShowChat] = useState(true)

  // Animate through loading messages
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => {
          if (prev < loadingMessages.length - 1) {
            return prev + 1
          } else {
            clearInterval(interval)
            // Start the chat interface after a brief delay
            setTimeout(() => {
              setShowChat(true)
            }, 1000)
            return prev
          }
        })
      }, 1500) // Change message every 1.5 seconds

      return () => clearInterval(interval)
    }
  }, [loading])

  //fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = searchParams.get('token')
        if (!token) {
          setError('No token provided')
          return
        }

        // For demo purposes, we'll use a fixed user ID
        // In a real app, you'd decode the token to get the user ID
        const userId = '550e8400-e29b-41d4-a716-446655440001'
        
        const userData = await getUser(userId)
        if (!userData) {
          setError('User not found')
          return
        }

        setUser(userData)
        
        // Simulate loading time for better UX
        setTimeout(() => {
          setLoading(false)
        }, 4500) // Total loading time: 4.5 seconds
        
      } catch (err) {
        console.error('Error fetching user:', err)
        setError('Failed to load user data')
        setLoading(false)
      }
    }

    fetchUser()
  }, [searchParams])


  

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-teal-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white p-8 rounded-2xl shadow-lg"
        >
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </motion.div>
      </div>
    )
  }

  //loading screen
  if (loading || !user || !showChat) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-teal-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              stiffness: 100
            }}
            className="mb-8"
          >
            <GoodHabitzLogo size="xl" className="mx-auto" />
          </motion.div>

          {/* Welcome Message */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-8"
          >
            Welcome to GoodHabitz
          </motion.h1>

          {/* Loading Messages */}
          <div className="h-16 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-lg text-gray-600"
              >
                {loadingMessages[currentMessageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Loading Spinner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          </motion.div>

          {/* Progress Dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center space-x-2 mt-6"
          >
            {loadingMessages.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= currentMessageIndex
                    ? 'bg-purple-600'
                    : 'bg-purple-200'
                }`}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <ChatProvider initialUser={user}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="h-screen flex bg-background"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-3"
              >
                <div className='flex flex-col items-start justify-start '>
                <GoodHabitzLogo size="sm" />
                  
                  <p className="text-sm text-muted-foreground ">
                    Welcome you to GoodHabitz. Share your goals and we will help you achieve them.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-right"
              >
                <p className="text-sm font-medium">{user.first_name} {user.last_name}</p>
                <p className="text-xs text-muted-foreground">{user.role} at {user.companies.name}</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-1 flex pt-20"
        >
          {/* Chat Interface */}
          <div className="flex-1 flex flex-col">
            <ChatBox />
          </div>

          {/* Course Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="w-80 border-l bg-muted/20"
          >
            <CourseBar />
          </motion.div>
        </motion.div>
      </motion.div>
    </ChatProvider>
  )
} 