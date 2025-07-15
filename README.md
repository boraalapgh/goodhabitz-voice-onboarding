# GoodHabitz Conversational Onboarding

A modern, AI-powered onboarding experience that personalizes learning recommendations through conversational chat with voice support.

## Features

- **Conversational AI**: Powered by OpenAI GPT-4o with tool-calling capabilities
- **Voice Support**: Speech-to-text using Whisper API with animated waveforms
- **Live Course Filtering**: Real-time course recommendations based on user preferences
- **Responsive Design**: Modern UI with purple-themed design system
- **No Authentication Required**: Simplified demo experience with seeded data

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui, Framer Motion
- **AI**: OpenAI GPT-4o, Whisper API, @openai/agents
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Getting Started

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd goodhabitz-onboarding
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.example` to `.env.local` and fill in your API keys:
   ```bash
   cp .env.example .env.local
   ```

3. **Set up Supabase**:
   - Create a new Supabase project
   - Run the seed script to populate the database
   ```bash
   npm run seed
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── welcome/           # Onboarding flow
│   ├── dashboard/         # Post-onboarding dashboard
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── onboarding/       # Onboarding-specific components
├── lib/                   # Utility functions
├── tools/                 # OpenAI agent tools
├── agents/               # AI agent configurations
├── types/                # TypeScript type definitions
└── supabase/             # Database schema and migrations
```

## Key Features

### AI-Powered Conversations
- Uses OpenAI's function calling to filter courses based on user preferences
- Maintains conversation context throughout the onboarding flow
- Provides personalized learning recommendations

### Voice Interaction
- Toggle between text and voice input
- Animated waveform visualization during recording
- Automatic speech-to-text transcription

### Live Course Filtering
- Real-time course recommendations in the sidebar
- Filter by skills, time commitment, and content type
- Visual course cards with category-based color coding

## Environment Variables

```env
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Deployment

The app is optimized for Vercel deployment:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary and confidential. 