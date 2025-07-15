import { AgentInputItem } from "@openai/agents"

// Database Types
export interface Company {
  id: string
  name: string
  industry: string
  learning_goal: string
  created_at: string
}

export interface User {
  id: string
  company_id: string
  first_name: string
  last_name: string
  email: string
  role: string
  created_at: string
}

export interface Course {
  id: string
  title: string
  kind: 'course' | 'lesson' | 'activity'
  duration: number // in minutes
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  content_skills: {
    skill_id: string
    skills: {
      name: string
    }
  }[]
}

export interface EventLog {
  id: string
  user_id: string
  event: string
  payload: Record<string, any>
  created_at: string
}

// Onboarding Types
export interface OnboardingPreferences {
  learningStyle: string
  interests: string[]
  goals: string[]
  experience: string
}

export interface ChatMessage {
  status: "in_progress" | "completed" | "incomplete";
  role: "assistant" | "user";
  content: ({ type: 'input_text'; text: string } | { type: 'input_file'; file: File } | { type: 'input_image'; image: string } | { type: 'input_audio'; audio: string } | { type: 'input_video'; video: string })[];
  type?: "message";
  id?: string;
}

export interface FilterCoursesParams {
  skills: string[]
  timeAvailable: string
  contentType: string
}

export interface FilterCoursesResult {
  path: string
  recommendedIds: string[]
}

// UI Types
export interface CourseCardProps {
  course: Course
  isRecommended?: boolean
}

export interface VoiceRecorderProps {
  isRecording: boolean
  onStartRecording: () => void
  onStopRecording: () => void
  onTranscript: (transcript: string) => void
}

// Agent Response Types
export interface AgentResponseWithSuggestions {
  content: string
  suggestions?: string[]
}

export interface ChatContextType {
  messages: AgentInputItem[]
  isLoading: boolean
  preferences: Partial<OnboardingPreferences>
  recommendedCourses: Course[]
  suggestions: string[]
  addMessage: (message: AgentInputItem) => void
  updatePreferences: (preferences: Partial<OnboardingPreferences>) => void
  setRecommendedCourses: (courses: Course[]) => void
  setIsLoading: (loading: boolean) => void
  setSuggestions: (suggestions: string[]) => void
} 