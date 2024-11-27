# WhatsApp Bot with Gemini AI Integration

A sophisticated WhatsApp bot built with TypeScript that leverages Google's Gemini AI for image analysis and document validation. The bot manages user data through structured conversational flows and provides secure document processing capabilities.

## Core Features

- **WhatsApp Integration**: Robust message handling using whatsapp-web.js library
- **Conversational Flows**: 
  - Multi-step user data collection
  - Context-aware conversations
  - State management for incomplete flows
- **Document Processing**:
  - Aadhar card validation using Gemini AI
  - Image analysis and description generation
  - Secure local file storage
- **Data Management**:
  - JSON-based local storage system
  - UUID-based unique identifiers
  - Zod schema validation

## Technical Architecture

### Backend Stack
- **Runtime**: Node.js (v14+)
- **Language**: TypeScript
- **Main Libraries**:
  - whatsapp-web.js - WhatsApp client
  - @google/generative-ai - Gemini AI integration
  - zod - Runtime type checking
  - express - HTTP server (prepared for future API endpoints)
  - uuid - Unique ID generation

### Key Components
- **Services**:
  - WhatsAppService: Handles message routing and user interactions
  - GeminiService: Manages AI-powered image analysis
  - StorageService: Handles local file and data management
- **Types**: Comprehensive TypeScript definitions for type safety
- **Utils**: Helper functions for common operations

## Setup Requirements

### Prerequisites
- Node.js >= 14.0.0
- Active WhatsApp account for bot operation
- Google Cloud account with Gemini API access
- Basic understanding of TypeScript and Node.js

### Environment Configuration

Required environment variables in `.env`: