'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CourseCard } from './CourseCard'
import { useChatContext } from '../contexts/ChatContext'

export const CourseBar: React.FC = () => {
  const { recommendedCourses } = useChatContext()
  console.log("recommendedCourses",recommendedCourses);

  return (
    <div className="w-80 bg-background border-l border-border flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Based on your goals
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {recommendedCourses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Answer the questions in the chat to get personalized course recommendations!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {recommendedCourses.slice(0, 3).map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isRecommended={true}
              />
            ))}
          </div>
        )}
      </CardContent>
    </div>
  )
} 