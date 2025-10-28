# Green Bio Compute Platform

## Overview

Green Bio Compute is an enterprise wet lab emissions tracking platform designed for biotech facilities. The system monitors carbon footprint from laboratory equipment in real-time, integrating with Building Management Systems (BMS), Laboratory Information Management Systems (LIMS), and equipment manufacturer APIs. The platform aims to provide predictive maintenance alerts, optimization recommendations, and compliance reporting for GHG Protocol, ISO 14064, and CSRD standards.

The application is currently in early development phase with a functional UI prototype built on mock data. The core infrastructure is in place, but backend services, database persistence, and external integrations are not yet implemented.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight React Router alternative)
- TanStack Query v5 for server state management and API caching
- Tailwind CSS for styling with custom design system

**Component Library:**
- shadcn/ui (New York variant) - Radix UI primitives with Tailwind styling
- Custom theme system supporting dark/light modes with CSS variables
- Material Design 3 principles adapted for scientific data visualization

**Design System:**
- Primary color palette based on professional blues (220° hue)
- Dark mode as default for reduced eye strain during data-heavy workflows
- Semantic colors for emissions levels (green/amber/red)
- Typography: Inter for UI, JetBrains Mono for numerical data
- Responsive layout with mobile-first approach

**Key UI Patterns:**
- Dashboard with metric cards showing real-time emissions data
- Equipment inventory with search, filtering, and detail modals
- Chart visualizations using Recharts for emissions trends and breakdowns
- Empty states with actionable CTAs for onboarding
- Alert panels for predictive maintenance notifications

**State Management:**
- TanStack Query for server state with query invalidation
- React Context for theme management
- Local component state for UI interactions
- No global state management library (Redux/Zustand) currently used

### Backend Architecture

**Framework & Runtime:**
- Express.js server with TypeScript
- Node.js runtime environment
- ESM module system throughout

**API Design:**
- RESTful endpoints (currently minimal implementation)
- `/api/equipment` - Equipment CRUD operations
- `/api/equipment/upload` - CSV file processing for bulk imports
- `/api/chat` - AI assistant endpoint (planned)
- Multer middleware for file uploads
- JSON responses with proper error handling

**Data Processing:**
- CSV parsing using csv-parse library
- Equipment embeddings generation using Transformers.js (all-MiniLM-L6-v2 model)
- Vector similarity search capability for semantic equipment queries

**Server Architecture Decisions:**
- Middleware-based request logging with timing metrics
- Error handling with centralized error middleware
- Vite integration in development mode for HMR
- Static file serving in production build
- Session management prepared (connect-pg-simple installed but not configured)

### Data Storage

**Database:**
- PostgreSQL (via Neon serverless)
- Drizzle ORM for type-safe database access
- WebSocket constructor override for Neon's serverless architecture

**Schema Design (Defined but Not Fully Implemented):**
- `users` table - Authentication (username/password, UUID primary keys)
- `equipment` table - Lab equipment inventory with carbon footprint metrics
  - Fields: name, category, type, manufacturer, carbon footprint, annual usage, API capabilities
  - Numeric fields for emissions calculations stored as `numeric` type
- `equipment_embeddings` table - Vector embeddings for semantic search
  - 384-dimensional vectors using pgvector extension
  - Cascade delete on equipment removal

**Current Storage Gap:**
- In-memory storage implementation exists as fallback
- Database migrations not yet applied
- No connection pooling configuration
- No data seeding strategy

**Data Model Patterns:**
- Zod schemas generated from Drizzle tables for runtime validation
- Shared types between frontend/backend via `@shared/schema`
- Insert types separate from select types (omitting auto-generated fields)

### External Dependencies

**Third-Party Services:**
1. **Building Management Systems (BMS)**
   - Planned: Johnson Controls integration
   - Purpose: Real-time facility power consumption data
   - Status: Not implemented

2. **Laboratory Information Management Systems (LIMS)**
   - Planned: Benchling API integration
   - Purpose: Equipment usage tracking and experiment correlation
   - Status: Not implemented

3. **Equipment Manufacturer APIs**
   - Thermo Fisher Connect
   - Eppendorf VisioNize
   - Bio-Rad cloud platforms
   - Purpose: Direct equipment telemetry and diagnostics
   - Status: Not implemented

4. **AI/ML Services**
   - Transformers.js (local inference) - all-MiniLM-L6-v2 for embeddings
   - Purpose: Semantic search and AI assistant features
   - Status: Embedding generation implemented, chat not implemented

**Database & Infrastructure:**
- Neon Postgres (serverless PostgreSQL)
- WebSocket support required for serverless connections

**Development Tools:**
- Replit-specific plugins (cartographer, dev-banner, runtime-error-overlay)
- Only enabled in development environment

**Key Architectural Gaps:**
1. No authentication/authorization system implemented
2. No background job processing (planned for API polling)
3. No real-time updates (WebSocket infrastructure not set up)
4. No rate limiting or API gateway
5. No monitoring/observability tooling
6. No data validation between services
7. No CSV import workflow beyond basic parsing
8. No emissions calculation engine implementation