# Nordson Pump Rotation Logger

## Overview

An industrial data collection web application designed to replace manual Excel spreadsheet entry for daily Nordson pump rotation data collection. The system manages production line data across multiple manufacturing lines (L80-L94), with distinct data schemas based on line groupings. Built with a focus on efficiency, data accuracy, and industrial workplace usability, all interface elements are presented in Portuguese (Brazil).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript and Vite for development and building
- Wouter for client-side routing
- TanStack Query (React Query) for server state management and data fetching
- React Hook Form with Zod validation for form handling
- Date-fns for date manipulation and formatting (Portuguese locale)

**UI Component System:**
- Shadcn UI (New York variant) as the design system foundation
- Radix UI primitives for accessible, unstyled components
- Tailwind CSS for styling with custom design tokens
- Coss UI design principles for industrial-focused interface patterns

**State Management:**
- TanStack Query for server state with custom query client configuration
- Local component state for UI interactions
- Form state managed by React Hook Form

**Key Design Decisions:**
- Single-page application with tab-based navigation (Data Entry / Dashboard)
- Two separate form components (FormularioGrupo1, FormularioGrupo2) to handle different production line data schemas
- Mobile-responsive design with custom breakpoint detection hook
- ExcelJS library for complex Excel export functionality with custom formatting

### Backend Architecture

**Technology Stack:**
- Node.js with Express framework
- TypeScript for type safety across the stack
- Drizzle ORM for database operations
- Neon serverless PostgreSQL driver

**API Design:**
- RESTful API endpoints following resource-based patterns
- Separate endpoints for each data group (grupo1, grupo2)
- Standard CRUD operations (GET, POST, PUT, DELETE)
- Zod schema validation on request payloads

**Storage Implementation:**
- Dual-strategy storage interface (IStorage) allowing for:
  - In-memory storage (MemStorage) for development/testing
  - Database storage for production
- Centralized storage abstraction for easy switching between implementations

**Middleware & Request Handling:**
- JSON body parsing with raw body preservation for webhook compatibility
- Request/response logging for API endpoints
- Error handling with appropriate HTTP status codes

### Data Storage Solutions

**Database Schema:**
- PostgreSQL as the primary database (via Neon serverless)
- Drizzle ORM for type-safe database operations and migrations
- Two distinct tables reflecting business logic requirements:

**Table 1: coleta_grupo1** (Lines L90, L91, L92, L93, L94, L80, L81, L82, L83)
- 18 pump measurement columns plus metadata
- Fields: SKU, bag weight, line speed, and 18 pump-specific measurements (core_attach, core_wrap, surge, etc.)

**Table 2: coleta_grupo2** (Lines L84, L85)
- 20 pump measurement columns plus metadata  
- Fields: SKU, bag weight, line speed, and 20 pump-specific measurements (waist_packer, isg_elastic, etc.)

**Schema Rationale:**
- Separate tables chosen over polymorphic design due to fundamentally incompatible column structures
- Allows for proper type safety and validation per group
- Simplifies queries and reduces nullable columns

**Shared Fields:**
- id (primary key, auto-increment)
- created_at (timestamp)
- data_coleta (collection date)
- linha_producao (production line)
- sku (product identifier)
- peso_sacola_varpe (bag weight)
- velocidade_linha (line speed)

### External Dependencies

**Database Service:**
- Neon Serverless PostgreSQL - Managed PostgreSQL hosting
- Connection via @neondatabase/serverless package
- Database URL configured via environment variable (DATABASE_URL)

**UI Component Libraries:**
- Radix UI - Comprehensive set of unstyled, accessible components
- Shadcn UI - Pre-styled component patterns built on Radix
- Lucide React - Icon library for UI elements

**Development Tools:**
- Vite - Build tool and development server
- Drizzle Kit - Database migration management
- TSX - TypeScript execution for development
- ESBuild - Production bundling

**Data Processing:**
- ExcelJS - Excel file generation with complex formatting
- Zod - Runtime type validation and schema definition
- date-fns - Date manipulation with Portuguese localization

**Replit Integration:**
- @replit/vite-plugin-runtime-error-modal - Development error overlay
- @replit/vite-plugin-cartographer - Code navigation
- @replit/vite-plugin-dev-banner - Development environment indicator

**Key Architectural Patterns:**
- Shared schema definitions between client and server via TypeScript path aliases
- Type inference from Drizzle schema using createInsertSchema
- Custom API request wrapper with error handling
- Query client configuration with disabled automatic refetching for stable industrial data entry