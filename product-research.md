# WhatsApp Bot - Product Research Document

## 1. Technical Architecture

### Core Components
1. **WhatsApp Integration Layer**
   - Using whatsapp-web.js for message handling
   - WebSocket connection for real-time messaging
   - QR code authentication system
   - Session management

2. **Application Layer**
   - Node.js + Express backend
   - TypeScript for type safety
   - State management for conversation flow
   - Input validation using Zod
   - Error handling middleware

3. **Data Layer**
   - Supabase PostgreSQL for user data
   - Supabase Storage for Aadhar card documents
   - Data encryption for sensitive information
   - Backup and recovery systems

## 2. Core Stack

### Backend Framework
1. **Node.js + Express**
   - Handles HTTP requests/webhooks from WhatsApp
   - Routes management
   - Middleware processing
   - Error handling
   - Request/Response lifecycle

2. **TypeScript**
   - Type safety for data structures
   - Interface definitions for WhatsApp payloads
   - Better IDE support/autocomplete
   - Catch errors at compile time

3. **Supabase**
   - User data storage (PostgreSQL)
   - Session state management
   - File storage (Aadhar documents)
   - Real-time capabilities if needed
   - Row level security

4. **Railway/Vercel**
   - Automated deployments
   - SSL certificates
   - Environment variables
   - Logs management
   - Auto-scaling

### Key Packages
1. **@supabase/supabase-js**
   - Database operations
   - File uploads/downloads
   - Real-time subscriptions
   - Type definitions

2. **whatsapp-web.js**
   - Message handling
   - Send/receive messages
   - Media handling
   - Message templates
   - Button interactions

3. **zod**
   - Input validation
   - Runtime type checking
   - Data transformation
   - Error messages
   - Schema definitions

4. **axios**
   - HTTP requests
   - WhatsApp API calls
   - External API integration
   - Request interceptors
   - Error handling

## 3. Data Flow

1. Message Reception:
   WhatsApp → Webhook → Controller → Service → Supabase

2. File Upload:
   WhatsApp → Webhook → Controller → Storage Service → Supabase Storage

3. Response:
   Service → WhatsApp API → User

## 4. Data Models

```typescript
interface User {
  id: string;
  whatsapp_number: string;
  name: string;
  district: string;
  city: string;
  state: string;
  aadhar_document_url: string;
  conversation_state: ConversationState;
  created_at: Date;
  updated_at: Date;
}

enum ConversationState {
  WELCOME = 'welcome',
  ASKING_NAME = 'asking_name',
  ASKING_DISTRICT = 'asking_district',
  ASKING_CITY = 'asking_city',
  ASKING_STATE = 'asking_state',
  REQUESTING_AADHAR = 'requesting_aadhar',
  COMPLETED = 'completed'
}
```

## 5. Security Considerations

1. **Data Protection**
   - End-to-end encryption for messages
   - Secure storage of Aadhar cards
   - Access control using Supabase RLS
   - Data retention policies

2. **Authentication & Authorization**
   - WhatsApp number verification
   - Session management
   - Rate limiting
   - IP whitelisting

## 6. Scalability Considerations

1. **Infrastructure**
   - Containerized deployment on Railway/Vercel
   - Auto-scaling configuration
   - Load balancing
   - CDN for static assets

2. **Database**
   - Connection pooling
   - Query optimization
   - Indexing strategy
   - Caching layer

## 7. Development Phases

### Phase 1: Basic Setup
- WhatsApp connection setup
- Basic message handling
- Database schema creation
- Environment configuration

### Phase 2: Conversation Flow
- Welcome message implementation
- User data collection flow
- State management
- Input validation

### Phase 3: Document Handling
- Aadhar card upload
- Storage integration
- File validation
- Security measures

### Phase 4: Testing & Deployment
- Unit tests
- Integration tests
- Deployment pipeline
- Monitoring setup

## 8. Monitoring & Analytics

1. **Key Metrics**
   - Message response time
   - Conversation completion rate
   - Error rates
   - Storage usage

2. **Logging**
   - Application logs
   - Error tracking
   - User activity
   - Performance metrics

## 9. Cost Considerations

1. **Infrastructure Costs**
   - Railway/Vercel hosting
   - Supabase usage
   - Storage costs
   - Backup storage

2. **API Costs**
   - WhatsApp Business API fees
   - Third-party service costs
   - Monitoring tools

## 10. Compliance & Legal

1. **Data Privacy**
   - GDPR considerations
   - Data storage regulations
   - User consent management
   - Privacy policy requirements

2. **Document Handling**
   - Aadhar card storage regulations
   - Data retention policies
   - Access control policies

## 11. Project Structure

```
whatsapp-bot/
├── src/
│   ├── config/                 # Configuration files
│   │   ├── database.ts        # Supabase configuration
│   │   ├── whatsapp.ts        # WhatsApp client configuration
│   │   └── constants.ts       # Global constants
│   │
│   ├── controllers/           # Request handlers
│   │   ├── webhook.ts         # WhatsApp webhook controller
│   │   └── auth.ts           # Authentication controller
│   │
│   ├── services/             # Business logic
│   │   ├── whatsapp.ts       # WhatsApp message handling
│   │   ├── user.ts           # User management
│   │   └── storage.ts        # File storage operations
│   │
│   ├── models/               # Type definitions & interfaces
│   │   ├── user.ts          # User model
│   │   └── conversation.ts   # Conversation state model
│   │
│   ├── utils/                # Helper functions
│   │   ├── validation.ts     # Input validation
│   │   ├── encryption.ts     # Data encryption
│   │   └── logger.ts         # Logging utility
│   │
│   ├── middleware/           # Express middleware
│   │   ├── auth.ts          # Authentication middleware
│   │   ├── validation.ts     # Request validation
│   │   └── error.ts         # Error handling
│   │
│   └── routes/              # API routes
│       └── webhook.ts       # WhatsApp webhook routes
│
├── tests/                   # Test files
│   ├── unit/               # Unit tests
│   └── integration/        # Integration tests
│
├── scripts/                # Utility scripts
│   ├── deploy.sh          # Deployment script
│   └── setup-db.ts        # Database setup
│
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore file
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── jest.config.js        # Test configuration
└── README.md             # Project documentation
```

### Key Directories Explained

1. **src/config/**
   - Central location for all configuration
   - Environment-specific settings
   - Third-party service configurations

2. **src/controllers/**
   - HTTP request handlers
   - Request/response processing
   - Route-specific logic

3. **src/services/**
   - Core business logic
   - External service integrations
   - Data processing

4. **src/models/**
   - TypeScript interfaces
   - Type definitions
   - Data schemas

5. **src/utils/**
   - Shared utility functions
   - Helper methods
   - Common operations

6. **src/middleware/**
   - Request preprocessing
   - Authentication
   - Validation
   - Error handling

7. **src/routes/**
   - API endpoint definitions
   - Route grouping
   - Middleware attachment

8. **tests/**
   - Organized by test type
   - Mirrors src structure
   - Test utilities and mocks