# AI Delivery Assistant

## Overview

This is a full-stack web application that provides an AI-powered delivery assistant system. The application helps manage delivery calls, configure AI voice responses, and track delivery performance through an intuitive dashboard interface. The system integrates with Twilio for voice calling capabilities and OpenAI for intelligent conversation handling, specifically designed for the Indian delivery market with Hindi-English mixed language support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod schema validation
- **Design System**: Custom color scheme with CSS variables, supporting both light and dark modes

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON communication
- **Session Management**: Express sessions with PostgreSQL session store

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database serverless
- **ORM**: Drizzle ORM with Zod schema validation
- **Schema Design**: Four main tables:
  - Users (authentication)
  - Call logs (delivery call records)
  - Delivery settings (configurable delivery parameters)
  - AI configuration (voice and language settings)
- **Fallback Storage**: In-memory storage implementation for development/testing

### Authentication and Authorization
- **Session-based Authentication**: Using Express sessions
- **Password Storage**: Plain text storage (development setup)
- **Session Persistence**: PostgreSQL session store via connect-pg-simple

### External Service Integrations

#### Voice Communication
- **Twilio Integration**: 
  - Voice calling capabilities
  - Call management and status tracking
  - Webhook handling for call events
  - Environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER

#### AI Processing
- **OpenAI Integration**:
  - GPT-4o model for conversation processing
  - Hindi-English mixed language support
  - Context-aware response generation
  - Information extraction from conversations
  - Environment variable: OPENAI_API_KEY

#### Development Tools
- **Replit Integration**: 
  - Development environment support
  - Hot module replacement
  - Error overlay for development
  - Cartographer plugin for debugging

### Key Features
- **Dashboard**: Real-time call statistics and performance metrics
- **Call Management**: Complete call log tracking with status updates
- **AI Configuration**: Voice model, language, and personality settings
- **Delivery Settings**: Customizable delivery instructions and escalation rules
- **Live Call Monitoring**: Real-time call status and transcript viewing
- **Multi-language Support**: Hindi-English code-mixed conversations

### Development Workflow
- **Development Server**: Concurrent frontend (Vite) and backend (tsx) serving
- **Production Build**: Static frontend build with bundled backend
- **Database Migrations**: Drizzle Kit for schema management
- **Type Safety**: Shared TypeScript schemas between frontend and backend