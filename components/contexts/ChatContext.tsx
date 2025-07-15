'use client'

import React, { createContext, useContext, useReducer, useCallback,  useEffect } from 'react'
import { ChatMessage, OnboardingPreferences, Course,  User, Company } from '@/types'

import { getCourses } from '@/lib/supabase'
import { AgentInputItem, AssistantMessageItem } from '@openai/agents'


interface ChatState {
  messages: AgentInputItem[]
  isLoading: boolean
  preferences: Partial<OnboardingPreferences>
  recommendedCourses: Course[]
  isVoiceMode: boolean
  suggestions: string[]
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: ChatState['messages'][0] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<OnboardingPreferences> }
  | { type: 'SET_RECOMMENDED_COURSES'; payload: Course[] }
  | { type: 'SET_VOICE_MODE'; payload: boolean }
  | { type: 'SET_SUGGESTIONS'; payload: string[] }

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'UPDATE_PREFERENCES':
      return { ...state, preferences: { ...state.preferences, ...action.payload } }
    case 'SET_RECOMMENDED_COURSES':
      return { ...state, recommendedCourses: action.payload }
    case 'SET_VOICE_MODE':
      return { ...state, isVoiceMode: action.payload }
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.payload }
    default:
      return state
  }
}

const initialState: ChatState = {
  messages: [{
    role: "assistant",
    content: [{
      type: "output_text",
      text: "Welcome to GoodHabitz. I'm here to help you achieve your goals. I have few questions to get to know you better. can we start with those?"
    }],
    status: "completed"
  }],
  isLoading: false,
  preferences: {},
  recommendedCourses: [],
  isVoiceMode: false,
  suggestions: [],
}

interface ExtendedChatContextType {
  messages: AgentInputItem[]
  isLoading: boolean
  preferences: Partial<OnboardingPreferences>
  recommendedCourses: Course[]
  user: User & { companies: Company }
  isVoiceMode: boolean
  suggestions: string[]
  addMessage: (message: AgentInputItem) => void
  updatePreferences: (preferences: Partial<OnboardingPreferences>) => void
  setRecommendedCourses: (courses: Course[]) => void
  setIsLoading: (loading: boolean) => void
  setVoiceMode: (enabled: boolean) => Promise<void>
  setSuggestions: (suggestions: string[]) => void
}

const ChatContext = createContext<ExtendedChatContextType | undefined>(undefined)

export const useChatContext = (): ExtendedChatContextType => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}

interface ChatProviderProps {
  children: React.ReactNode
  initialUser: User & { companies: Company }
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children, initialUser }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState)
  
  useEffect(() => {
    const fetchCourses = async () => {
      const courses = await getCourses()
      setRecommendedCourses(courses)
    }
    fetchCourses()
  }, [])

  const addMessage = useCallback((message: AgentInputItem) => {
    dispatch({ type: 'ADD_MESSAGE', payload: {...message} })
  }, [])

  const updatePreferences = useCallback((preferences: Partial<OnboardingPreferences>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences })
  }, [])

  const setRecommendedCourses = useCallback((courses: Course[]) => {
    dispatch({ type: 'SET_RECOMMENDED_COURSES', payload: courses })
  }, [])

  const setIsLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }, [])

  const setVoiceMode = useCallback(async (enabled: boolean) => {
    dispatch({ type: 'SET_VOICE_MODE', payload: enabled })
  }, [])

  const setSuggestions = useCallback((suggestions: string[]) => {
    dispatch({ type: 'SET_SUGGESTIONS', payload: suggestions })
  }, [])

  // Send message function that works for both text and voice modes


  const value: ExtendedChatContextType = {
    messages: state.messages,
    isLoading: state.isLoading,
    preferences: state.preferences,
    recommendedCourses: state.recommendedCourses,
    user: initialUser,
    isVoiceMode: state.isVoiceMode,
    suggestions: state.suggestions,
    addMessage,
    updatePreferences,
    setRecommendedCourses,
    setIsLoading,
    setVoiceMode,
    setSuggestions,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
} 