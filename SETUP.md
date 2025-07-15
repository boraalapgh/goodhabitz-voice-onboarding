# GoodHabitz Conversational Onboarding - Setup Guide

## What We've Built

A complete AI-powered onboarding application with the following features:

✅ **Conversational AI Chat** - GPT-4o powered onboarding assistant  
✅ **Voice Support** - Speech-to-text with Whisper API and animated waveforms  
✅ **Live Course Filtering** - Real-time recommendations based on user preferences  
✅ **Modern UI** - Purple-themed design with Tailwind CSS and Framer Motion  
✅ **Database Integration** - Supabase with seeded demo data  
✅ **Responsive Design** - Mobile and desktop optimized  

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Copy `.env.local` and add your API keys:

```bash
# Required: OpenAI API Key
OPENAI_API_KEY=sk-your-openai-key-here

# Required: Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set Up Database
1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Run the seed data from `supabase/seed.sql`

### 4. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000 to see the application.

## Features Implemented

### Core Functionality
- **Welcome Page** (`/welcome?token=demo-token-123`) - Main onboarding flow
- **Dashboard** (`/dashboard`) - Post-onboarding course recommendations
- **Chat Interface** - AI-powered conversation with function calling
- **Voice Recording** - Whisper API integration with waveform animation
- **Course Filtering** - Dynamic recommendations based on preferences

### API Routes
- `/api/chat` - OpenAI chat completions with tool calling
- `/api/transcribe` - Whisper audio transcription

### Database Structure
- **Companies** - Demo company (Acme Healthcare)
- **Users** - Demo user (Jamie Doe, Project Engineer)
- **Courses** - 25 sample courses across different categories
- **Event Logs** - User interaction tracking

### UI Components
- Fully responsive chat interface
- Animated course cards with category color coding
- Voice recorder with purple-to-teal gradient waveform
- Modern card-based dashboard
- Smooth animations with Framer Motion

## Demo Flow

1. **Landing** - Visit `/` redirects to welcome page with demo token
2. **Greeting** - AI introduces itself and explains the onboarding process
3. **Questions** - Four personalization questions:
   - Time commitment for learning
   - Personal micro-goal
   - Reason for using GoodHabitz
   - Preferred content type
4. **Recommendations** - AI uses function calling to filter and recommend courses
5. **Course Bar** - Live updates showing recommended courses
6. **Completion** - Option to take Talent Scan or proceed to dashboard

## Architecture Highlights

### AI Integration
- OpenAI GPT-4o with function calling
- Custom `filterCourses` tool for dynamic recommendations
- Streaming responses for real-time interaction
- Context-aware conversation state management

### Voice Features
- MediaRecorder API for audio capture
- Whisper API for transcription
- Animated waveform visualization
- Automatic cleanup of audio data

### State Management
- React Context for chat state
- useReducer for complex state updates
- Real-time course recommendations
- Persistent conversation history

### Styling
- Purple primary color (#7B5BFF)
- Accent colors: teal, coral, lemon
- Large rounded corners (rounded-2xl)
- Subtle shadows and spacious padding
- Inter font family

## Production Considerations

### Required for Production
1. **Environment Variables**
   - Valid OpenAI API key
   - Supabase project with proper configuration
   
2. **Database Setup**
   - Run schema and seed scripts
   - Configure Row Level Security policies
   - Set up proper indexing

3. **Deployment**
   - Vercel recommended for Next.js
   - Environment variables in deployment dashboard
   - Edge functions for optimal performance

### Optional Enhancements
- Real authentication system (replace demo token)
- Additional course content and categories
- Advanced talent scan integration
- Analytics and tracking
- Multi-language support

## Troubleshooting

### Common Issues

**TypeScript Errors**
- Run `npm install` to ensure all dependencies are installed
- Check that all import paths are correct

**API Errors**
- Verify OpenAI API key is valid and has credits
- Check Supabase URL and anon key are correct
- Ensure database is properly seeded

**Voice Not Working**
- Check browser permissions for microphone access
- Verify HTTPS in production (required for MediaRecorder)
- Test with latest Chrome/Firefox browsers

**Database Issues**
- Run schema.sql first, then seed.sql
- Check RLS policies are properly configured
- Verify table names match the TypeScript types

## Next Steps

To extend this application:

1. **Authentication** - Implement proper user authentication
2. **Content Management** - Add admin interface for course management
3. **Progress Tracking** - Track user completion and progress
4. **Advanced AI** - Add more sophisticated learning path recommendations
5. **Integration** - Connect with LMS or HR systems
6. **Analytics** - Add user behavior tracking and insights

## Support

For questions or issues:
1. Check the README.md for additional documentation
2. Review the TypeScript types in `/types/index.ts`
3. Examine the agent configuration in `/agents/onboardingAgent.ts`
4. Test API routes directly using tools like Postman 