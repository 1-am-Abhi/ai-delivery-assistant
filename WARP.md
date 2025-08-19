# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Start development server (frontend + backend)
npm run dev

# Type check the entire codebase
npm run check

# Build for production
npm run build

# Start production server
npm run start

# Database schema push (when schema changes)
npm run db:push
```

### Environment Setup
The application requires these environment variables:
- `DATABASE_URL` - PostgreSQL connection string (Neon Database)
- `OPENAI_API_KEY` - OpenAI API key for AI conversations
- `TWILIO_ACCOUNT_SID` - Twilio account identifier
- `TWILIO_AUTH_TOKEN` - Twilio authentication token  
- `TWILIO_PHONE_NUMBER` - Twilio phone number for calls

## Architecture Overview

This is a **full-stack AI delivery assistant** built as a monorepo with three main layers:

### Frontend (`/client`)
- **React + TypeScript** with Vite build system
- **Shadcn/ui components** on top of Radix UI primitives
- **TanStack Query** for server state management with optimistic updates
- **Wouter** for lightweight client-side routing
- **React Hook Form + Zod** for form validation
- Located in `/client/src/` with pages, components, hooks, and lib utilities

### Backend (`/server`) 
- **Express.js with TypeScript** using ES modules
- **RESTful API** design with JSON communication
- **Drizzle ORM** with PostgreSQL (Neon Database serverless)
- **Session-based authentication** (development setup)
- **Twilio webhooks** for voice call handling
- **OpenAI GPT-4o integration** for Hindi-English mixed conversations

### Shared (`/shared`)
- **Unified TypeScript schemas** using Drizzle + Zod
- **Type-safe communication** between frontend and backend
- Database table definitions and validation schemas

## Key Integration Points

### Database Schema (4 main tables):
1. **users** - Basic authentication
2. **callLogs** - Complete call records with transcripts, status tracking
3. **deliverySettings** - Configurable delivery instructions, COD/OTP settings  
4. **aiConfiguration** - Voice model, language, personality settings for AI

### External Service Architecture:
- **Twilio Voice API**: Handles incoming calls via webhooks at `/api/twilio/voice` and `/api/twilio/gather/:callId`
- **OpenAI GPT-4o**: Processes Hindi-English mixed conversations, extracts delivery information
- **Neon Database**: Serverless PostgreSQL with fallback to in-memory storage

### API Patterns:
- **Call logs**: CRUD operations with real-time status updates
- **Settings**: Configuration endpoints for delivery and AI parameters
- **Webhooks**: Twilio voice processing with conversation state management
- **Test calls**: Programmatic call initiation for testing

## Development Context

### Language Support
The system is designed for **Indian delivery market** with:
- Hindi-English code-mixed conversations
- Cultural context awareness in AI responses
- Regional phone number formatting

### Call Flow Architecture
1. Incoming call → Twilio webhook → Create call log
2. Speech input → OpenAI processing → Extract delivery info
3. Conversation state → Database updates → Response generation
4. Call completion/escalation → Final status update

### Storage Strategy
- **Production**: PostgreSQL via Neon Database with Drizzle ORM
- **Development**: In-memory storage implementation (`MemStorage` class)
- **Migrations**: Handled through Drizzle Kit

### Build Architecture
- **Development**: Concurrent Vite (frontend) + tsx (backend) with HMR
- **Production**: Static frontend build + bundled backend via esbuild
- **Replit Integration**: Special development plugins and error overlays

## Important File Locations

- **API Routes**: `/server/routes.ts` - All endpoint definitions
- **Database Schema**: `/shared/schema.ts` - Type-safe table definitions  
- **Storage Layer**: `/server/storage.ts` - Database abstraction with fallback
- **AI Service**: `/server/services/openai.ts` - Conversation processing
- **Twilio Service**: `/server/services/twilio.ts` - Voice call management
- **Frontend Pages**: `/client/src/pages/` - Dashboard, call logs, settings
- **UI Components**: `/client/src/components/` - Reusable UI elements

When working with this codebase, focus on the integration patterns between Twilio webhooks, OpenAI conversation processing, and the database state management. The system maintains conversation history and extracted delivery information throughout the call lifecycle.
