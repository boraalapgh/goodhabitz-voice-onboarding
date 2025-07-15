'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Mail, Calendar, User, Building2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleActivateAccount = () => {
    router.push('/welcome?token=demo-token-123')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Email Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-t-2xl shadow-md border-b p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Your GoodHabitz Invitation</h1>
              <p className="text-sm text-gray-500">From: hr@acme.com</p>
            </div>
          </div>
        </motion.div>

        {/* Email Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="rounded-t-none shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Today, 9:32 AM</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>Jamie Doe</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Building2 className="w-4 h-4" />
                    <span>ACME Healthcare</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to Your Learning Journey! 🚀
                </h2>
                
                <p className="text-gray-700 leading-relaxed">
                  Hi Jamie,
                </p>
                
                <p className="text-gray-700 leading-relaxed">
                  We're excited to welcome you to <strong>GoodHabitz</strong>! As part of ACME Healthcare's commitment to 
                  continuous learning and development, you now have access to our comprehensive learning platform.
                </p>

                <div className="bg-purple-50 border-l-4 border-purple-600 p-4 my-6">
                  <h3 className="font-semibold text-purple-900 mb-2">What's waiting for you:</h3>
                  <ul className="text-purple-800 space-y-1">
                    <li>• Personalized course recommendations</li>
                    <li>• Interactive learning experiences</li>
                    <li>• Progress tracking and achievements</li>
                    <li>• Skills development aligned with your role</li>
                  </ul>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  Our AI assistant will guide you through a quick onboarding to personalize your learning experience 
                  based on your goals, preferences, and available time.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  Ready to get started? Click the button below to activate your account and begin your personalized 
                  learning journey.
                </p>
              </div>

              {/* Activation Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="flex justify-center py-8"
              >
                <Button
                  onClick={handleActivateAccount}
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Activate My Account
                </Button>
              </motion.div>

              <div className="text-center text-sm text-gray-500 border-t pt-6">
                <p>This invitation was sent to jamie.doe@acme.com</p>
                <p className="mt-1">© 2024 GoodHabitz. All rights reserved.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 