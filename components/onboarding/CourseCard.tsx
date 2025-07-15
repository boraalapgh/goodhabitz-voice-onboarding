'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Star, BookOpen, Activity, GraduationCap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CourseCardProps } from '@/types'

const getCategoryColor = (category: string) => {
  const colors = {
    leadership: 'border-l-primary',
    management: 'border-l-blue-500',
    communication: 'border-l-green-500',
    collaboration: 'border-l-accent-teal',
    'personal-development': 'border-l-purple-500',
    productivity: 'border-l-yellow-500',
    wellbeing: 'border-l-pink-500',
    technical: 'border-l-gray-500',
    operations: 'border-l-orange-500',
    innovation: 'border-l-indigo-500',
    quality: 'border-l-red-500',
    'customer-service': 'border-l-accent-coral',
    strategy: 'border-l-violet-500',
    default: 'border-l-primary',
  }
  return colors[category as keyof typeof colors] || colors.default
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'course':
      return <BookOpen className="h-4 w-4" />
    case 'lesson':
      return <GraduationCap className="h-4 w-4" />
    case 'activity':
      return <Activity className="h-4 w-4" />
    default:
      return <BookOpen className="h-4 w-4" />
  }
}

const getDifficultyColor = (difficulty: string) => {
  
  
  switch (difficulty) {
    case 'beginner':
      return <span className='text-green-600 text-xs font-medium'>Beginner</span>
    case 'intermediate':
      return <span className='text-yellow-600 text-xs font-medium'>Intermediate</span>
    case 'advanced':
      return <span className='text-red-600 text-xs font-medium'>Advanced</span>
    default:
      return 'text-gray-600'
  }
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, isRecommended = false }) => {
  const categoryColor = getCategoryColor(course.category)
  const typeIcon = getTypeIcon(course.kind)
  


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className={`relative border-l-4 ${categoryColor} hover:shadow-lg transition-shadow duration-200`}>
      
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {typeIcon}
              <span className="text-xs font-medium text-muted-foreground uppercase">
                {course.kind}
              </span>
            </div>
           
            <div className="flex items-center gap-1 text-muted-foreground">
            
              {getDifficultyColor(course.difficulty)}
            </div>
          </div>
          
          <CardTitle className="text-base leading-tight">
            {course.title}
          </CardTitle>
          
          <CardDescription className="text-sm">
            {course.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {course.content_skills.slice(0, 3).map( (item, index) => {
                return (
                <span
                  key={index}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                >
                  {item.skills.name}
                </span>)
              })}
              {course.content_skills.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{course.content_skills.length - 3} more
                </span>
              )}
            </div>
            
            
          </div>

          <div className="flex items-center gap-1 mt-2 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{course.duration}min</span>
              
            </div>
          
          <Button
            className="w-full mt-3"
            size="sm"
            onClick={() => {
              // TODO: Implement course click logic
              console.log('Course clicked:', course.id)
            }}
          >
            {course.kind === 'course' ? 'Start Course' : 
             course.kind === 'lesson' ? 'Start Lesson' : 
             'Start Activity'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
} 