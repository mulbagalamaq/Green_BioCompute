# Green Bio Compute Platform

## Overview

Green Bio Compute is a wet lab emissions tracking MVP platform designed for biotech facilities. The system enables users to upload equipment data via CSV files, which are automatically processed and vectorized for semantic search. An AI assistant powered by Llama 3.3 70B provides natural language query capabilities over the equipment database, allowing users to ask questions like "Which freezers consume the most power?" or get optimization recommendations.

**Current Status:** MVP functional with core features implemented. The platform uses a zero-cost approach with CSV uploads instead of complex API integrations. Database persistence, embeddings generation, and RAG-powered chat are all working.

## Recent Changes (October 28, 2025)

- ✅ Implemented complete CSV upload pipeline with automatic embeddings generation
- ✅ Built RAG-powered AI Assistant using Llama 3.3 70B (via Groq API)
- ✅ Converted all pages from mock data to real database integration
- ✅ Fixed critical embeddings storage bug (JSON.stringify → number[] for pgvector)
- ✅ Updated model from decommissioned llama-3.1-70b-versatile to llama-3.3-70b-versatile
- ✅ Changed color theme from blue to green (Forest Green #228B22 + Sea Green #2E8B57)
- ✅ Created Dashboard with real metrics from database
- ✅ Equipment Inventory page with database-backed cards and search
- ✅ Sample CSV file created for testing (attached_assets/sample_equipment.csv)

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
- Biotech-inspired design aesthetic

**Design System:**
- **Primary color palette:** Forest Green (#228B22) + Sea Green (#2E8B57) for biotech aesthetic
- Dark mode as default for reduced eye strain during data-heavy workflows
- Semantic colors for emissions levels (green/amber/red)
- Typography: Inter for UI, JetBrains Mono for numerical data
- Responsive layout with mobile-first approach

**Key Pages:**
1. **Dashboard (/)** - Real-time metrics from database: total emissions, equipment count, average impact, emissions trends
2. **Equipment Inventory (/equipment)** - Database-backed equipment cards with search, filtering, and detail modals
3. **Data Upload (/data-upload)** - CSV file upload with drag-and-drop, automatic parsing and embeddings generation
4. **AI Assistant (/ai-assistant)** - Chat interface for natural language queries over equipment data
5. **API Integrations (/integrations)** - Placeholder for future BMS/LIMS connections
6. **Reports (/reports)** - Placeholder for compliance reporting
7. **Analytics (/analytics)** - Placeholder for advanced analytics
8. **Settings (/settings)** - Placeholder for configuration

**State Management:**
- TanStack Query for server state with query invalidation
- React Context for theme management
- Local component state for UI interactions

### Backend Architecture

**Framework & Runtime:**
- Express.js server with TypeScript
- Node.js runtime environment
- ESM module system throughout

**API Endpoints (Fully Implemented):**
- `GET /api/equipment` - Returns all equipment from PostgreSQL database
- `POST /api/equipment/upload` - CSV file upload, parsing, database insertion, embeddings generation
- `POST /api/chat` - RAG endpoint: embeds question → searches pgvector → retrieves top 5 → generates LLM response

**CSV Upload Pipeline:**
1. User uploads CSV via Data Upload page
2. Multer middleware processes file upload
3. csv-parse library parses CSV into records
4. Equipment records inserted into PostgreSQL
5. For each equipment: generate 384-dimensional embedding using all-MiniLM-L6-v2
6. Store embeddings as number[] in pgvector column (NOT JSON.stringify - critical fix)
7. Return success response with count

**RAG Pipeline (AI Assistant):**
1. User asks question via chat interface
2. Generate embedding for question using all-MiniLM-L6-v2
3. Vector similarity search in PostgreSQL using pgvector (cosine distance)
4. Retrieve top 5 most relevant equipment records
5. Build context string with equipment details
6. Send context + question to Llama 3.3 70B via Groq API
7. Return AI-generated answer to frontend

**Data Processing:**
- CSV parsing using csv-parse library
- Equipment embeddings generation using Transformers.js (all-MiniLM-L6-v2 model)
- Vector similarity search using pgvector extension for PostgreSQL
- Text embeddings: 384 dimensions, normalized, mean pooling

**Server Architecture Decisions:**
- Middleware-based request logging with timing metrics
- Error handling with centralized error middleware
- Vite integration in development mode for HMR
- Static file serving in production build

### Data Storage

**Database:**
- PostgreSQL (via Neon serverless)
- Drizzle ORM for type-safe database access
- pgvector extension for vector similarity search
- WebSocket constructor override for Neon's serverless architecture

**Schema Design (Fully Implemented):**

1. **`equipment` table** - Lab equipment inventory
   - id (varchar, UUID primary key)
   - name (varchar, equipment name)
   - category (varchar, e.g., "Laboratory Equipment")
   - type (varchar, e.g., "Ultra-low Temperature Freezer")
   - manufacturer (varchar, nullable)
   - carbon_footprint_kg (numeric, carbon footprint in kgCO2e)
   - annual_usage_hours (numeric, hours/year)
   - annual_carbon_impact_kg (numeric, kgCO2e/year)
   - has_api (boolean, nullable)
   - api_vendor (varchar, nullable)
   - created_at (timestamp)

2. **`equipment_embeddings` table** - Vector embeddings for semantic search
   - id (serial, primary key)
   - equipment_id (varchar, foreign key → equipment.id, cascade delete)
   - embedding (vector(384), pgvector type - stores number[] array)
   - text_content (text, original description used to generate embedding)
   - created_at (timestamp)

**Data Model Patterns:**
- Zod schemas generated from Drizzle tables for runtime validation
- Shared types between frontend/backend via `@shared/schema`
- Insert types separate from select types (omitting auto-generated fields)
- Equipment description format: "Equipment: {name}. Category: {category}. Type: {type}. Manufacturer: {manufacturer}. Carbon footprint: {X} kgCO2e. Annual usage: {Y} hours. Annual carbon impact: {Z} kgCO2e per year. Has API integration available via {vendor}."

### External Dependencies

**AI/ML Services (Fully Implemented):**
1. **Transformers.js** - Local embedding generation
   - Model: all-MiniLM-L6-v2 (384 dimensions)
   - Purpose: Generate embeddings for equipment descriptions and user queries
   - Status: ✅ Functional
   
2. **Groq API** - LLM inference
   - Model: llama-3.3-70b-versatile (Meta's latest 70B model, 128K context)
   - Purpose: Generate natural language responses for AI assistant
   - Status: ✅ Functional (GROQ_API_KEY stored in Replit Secrets)

**Database & Infrastructure:**
- Neon Postgres (serverless PostgreSQL with pgvector)
- WebSocket support for serverless connections

**Development Tools:**
- Replit-specific plugins (cartographer, dev-banner, runtime-error-overlay)
- Only enabled in development environment

**Deferred to Future Versions:**
The following integrations were planned but deferred for the MVP to avoid infrastructure costs:
1. Building Management Systems (BMS) - Johnson Controls
2. Laboratory Information Management Systems (LIMS) - Benchling
3. Equipment Manufacturer APIs - Thermo Fisher, Eppendorf, Bio-Rad

**Current Architecture Strengths:**
- ✅ Zero-cost MVP using CSV uploads instead of API integrations
- ✅ Fully functional RAG pipeline with semantic search
- ✅ Real database persistence with pgvector
- ✅ AI-powered natural language queries
- ✅ Green biotech aesthetic throughout

**Future Enhancements (Not Required for MVP):**
1. Authentication/authorization system
2. Background job processing for scheduled imports
3. Real-time updates via WebSocket
4. Rate limiting and API gateway
5. Monitoring/observability tooling
6. Advanced emissions calculation engine
7. Predictive maintenance alerts
8. Compliance reporting (GHG Protocol, ISO 14064, CSRD)
9. BMS/LIMS/Manufacturer API integrations

## Sample CSV Format

The system expects CSV files with the following columns:
- Category
- Equipment/Process
- Carbon Footprint (kgCO2e)
- Annual Usage (hours/runs)
- Annual Carbon Impact (kgCO2e)

Example file available at: `attached_assets/sample_equipment.csv`

## How to Use the Application

1. **Upload Equipment Data**
   - Navigate to Data Upload page
   - Upload a CSV file with equipment information
   - System automatically parses, stores, and generates embeddings

2. **View Dashboard**
   - See total emissions, equipment count, and trends
   - Charts show emissions breakdown by equipment type

3. **Browse Equipment**
   - View all equipment in inventory
   - Search and filter by name, type, or category
   - Click cards for detailed information

4. **Ask AI Questions**
   - Navigate to AI Assistant page
   - Type natural language questions like:
     - "Which equipment has the highest carbon impact?"
     - "Show me all freezers that consume more than 40,000 kgCO2e per year"
     - "What equipment should we optimize first?"
     - "Which manufacturers have API integration?"
   - AI responds with data-backed answers using RAG over your equipment database
