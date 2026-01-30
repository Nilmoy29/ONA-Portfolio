# System Architecture Overview

This document provides a comprehensive overview of the ONA Portfolio Website system architecture, including technology stack, data flow, and design decisions.

## 🏗️ Architecture Principles

### Core Principles
- **Scalability**: Modular design supporting future growth
- **Maintainability**: Clean code structure and comprehensive documentation
- **Security**: Multi-layer security with authentication and authorization
- **Performance**: Optimized for fast loading and responsive interactions
- **User Experience**: Intuitive interfaces with accessibility considerations

### Design Philosophy
- **Component-Based**: Reusable, modular React components
- **Type Safety**: Full TypeScript implementation for reliability
- **API-First**: RESTful API design with consistent patterns
- **Database-Centric**: PostgreSQL with optimized queries and relationships

## 🛠️ Technology Stack

### Frontend Layer
| Technology | Version | Purpose | Key Features |
|------------|---------|---------|--------------|
| **Next.js** | 14.x | React Framework | App Router, SSR, API Routes, Image Optimization |
| **React** | 18.x | UI Library | Component-based architecture, Hooks, Context |
| **TypeScript** | 5.x | Type Safety | Static typing, IntelliSense, compile-time checks |
| **Tailwind CSS** | 3.x | Styling | Utility-first CSS, responsive design, dark mode |

### Backend Layer
| Technology | Version | Purpose | Key Features |
|------------|---------|---------|--------------|
| **Supabase** | - | Backend-as-a-Service | PostgreSQL, Auth, Storage, Edge Functions |
| **PostgreSQL** | 15.x | Database | ACID compliance, JSON support, advanced queries |
| **Row Level Security** | - | Data Security | User-based data access control |

### Development & Deployment
| Technology | Version | Purpose | Key Features |
|------------|---------|---------|--------------|
| **ESLint** | - | Code Quality | Code linting, style consistency |
| **Prettier** | - | Code Formatting | Automated code formatting |
| **Netlify** | - | Deployment | CDN, CI/CD, preview deployments |
| **BMAD™** | - | Methodology | AI-powered development process |

### Development Tools
- **Cursor/VSCode**: IDE with BMAD integration
- **Git**: Version control with GitHub
- **Supabase CLI**: Database management and migrations

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Browser (Chrome, Firefox, Safari, Edge)               │ │
│  │  - Responsive Web App                                  │ │
│  │  - Progressive Web App features                        │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                 PRESENTATION LAYER                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Next.js Application Server                            │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  App Router (Pages & API Routes)                   │ │ │
│  │  │  - / (Home)                                        │ │ │
│  │  │  - /admin/* (Dashboard)                            │ │ │
│  │  │  - /api/* (API Endpoints)                          │ │ │
│  │  │  - /projects, /team, /services (Public)            │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                         │ │
│  │  Middleware                                             │ │
│  │  - Authentication                                      │ │
│  │  - Authorization                                        │ │
│  │  - CORS                                                 │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼ PostgreSQL Protocol
┌─────────────────────────────────────────────────────────────┐
│                  DATA LAYER                                 │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Supabase PostgreSQL Database                          │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  Core Tables:                                      │ │ │
│  │  │  - projects                                        │ │ │
│  │  │  - team_members                                     │ │ │
│  │  │  - services                                         │ │ │
│  │  │  - explore_content                                   │ │ │
│  │  │  - partners                                         │ │ │
│  │  │  - admin_profiles                                    │ │ │
│  │  │  - contact_submissions                               │ │ │
│  │  │  ├─────────────────────────────────────────────────────┤ │ │
│  │  │  Security Features:                                 │ │ │
│  │  │  - Row Level Security (RLS)                         │ │ │
│  │  │  - Authentication                                    │ │ │
│  │  │  - Authorization                                     │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Architecture

### Request Flow (Client → Server → Database)

```
1. User Request
   ↓
2. Next.js Middleware
   - Authentication check
   - Route protection
   ↓
3. Page Component / API Route
   - Server-side rendering (SSR)
   - Data fetching
   ↓
4. Supabase Client
   - Query optimization
   - RLS policy application
   ↓
5. PostgreSQL Database
   - Query execution
   - Data retrieval
   ↓
6. Response Processing
   - Data transformation
   - Error handling
   ↓
7. Client Rendering
   - React hydration
   - UI updates
```

### Authentication Flow

```
Login Request → Supabase Auth → JWT Token → Session Storage → API Access
     ↓              ↓              ↓            ↓              ↓
  Validate    Generate Token   Store Token   Validate     Authorize
  Credentials   & Refresh     in Browser     on Request     Actions
```

## 📁 Application Structure

### Directory Structure
```
ona-portfolio/
├── app/                          # Next.js App Router
│   ├── (public)/                # Public pages (group route)
│   │   ├── page.tsx            # Home page
│   │   ├── projects/           # Projects pages
│   │   ├── team/               # Team pages
│   │   ├── services/           # Services pages
│   │   └── contact/            # Contact page
│   ├── admin/                   # Admin dashboard
│   │   ├── layout.tsx          # Admin layout
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── projects/           # Project management
│   │   ├── team/               # Team management
│   │   └── [other-sections]/   # Other admin sections
│   ├── api/                     # API routes
│   │   ├── admin/              # Admin API endpoints
│   │   └── public/             # Public API endpoints
│   └── globals.css             # Global styles
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components
│   ├── admin/                   # Admin-specific components
│   ├── [feature]/               # Feature-specific components
│   └── [shared]/                # Shared components
├── lib/                         # Utility libraries
│   ├── supabase.ts              # Supabase client
│   ├── utils.ts                 # Utility functions
│   ├── validations.ts           # Data validation
│   └── types.ts                 # TypeScript types
├── hooks/                       # Custom React hooks
├── styles/                      # Additional styles
├── docs/                        # Documentation
├── .bmad-core/                  # BMAD methodology
└── [config-files]/              # Configuration files
```

### Component Architecture

#### Atomic Design Pattern
```
Atoms (Base) → Molecules (Composite) → Organisms (Complex) → Templates → Pages
  ↓              ↓                      ↓              ↓            ↓
Button      →  Form Field        →  Login Form  →  Login Page → Home Page
Input       →  Search Bar        →  Header      →  Dashboard  → Admin Page
Badge       →  Card              →  Project Grid→  Projects   → Projects Page
```

#### Component Categories
- **UI Components**: Base reusable elements (Button, Input, Modal)
- **Layout Components**: Page structure elements (Header, Sidebar, Footer)
- **Feature Components**: Business logic components (ProjectCard, TeamMember)
- **Page Components**: Route-specific components with data fetching

## 🗄️ Database Architecture

### Schema Design

#### Core Entities
```sql
-- Content Management
projects (id, title, slug, description, category_id, featured_image_url, gallery_images, client_name, location, project_status, is_published, sort_order)
team_members (id, name, slug, position, bio, profile_image_url, specializations, is_published, sort_order)
services (id, name, slug, description, service_type, icon, featured_image_url, is_published, sort_order)
explore_content (id, title, slug, content_type, content, excerpt, featured_image_url, author_id, is_published)
partners (id, name, slug, description, logo_url, website_url, is_published, sort_order)
categories (id, name, slug, description, color, sort_order)

-- User Management
admin_profiles (id, user_id, full_name, role, permissions, is_active, last_login, avatar_url)

-- System
contact_submissions (id, name, email, subject, message, status, is_read, admin_notes)
admin_activity_logs (id, user_id, action, entity_type, entity_id, details)
site_settings (id, key, value, description, data_type, category, is_public)
```

#### Relationships
- **Projects ↔ Categories**: Many-to-one (projects.category_id → categories.id)
- **Projects ↔ Team Members**: Many-to-many (project_team_members junction table)
- **Projects ↔ Partners**: Many-to-many (project_partners junction table)
- **Admin Profiles → Auth Users**: One-to-one (admin_profiles.user_id → auth.users.id)

### Security Model

#### Row Level Security (RLS)
- **Public Content**: Published projects, team members, services accessible to all
- **Admin Content**: Sensitive data protected by user authentication
- **User-Specific**: Contact submissions and activity logs scoped to user

#### Authentication & Authorization
- **JWT Tokens**: Stateless authentication with refresh tokens
- **Role-Based Access**: Admin, Editor, Viewer permissions
- **API Protection**: Middleware validation on all admin routes

## 🚀 Performance Architecture

### Optimization Strategies

#### Frontend Optimizations
- **Next.js App Router**: Automatic code splitting and optimization
- **Image Optimization**: Next.js Image component with WebP conversion
- **CSS Optimization**: Tailwind CSS purging and minification
- **Bundle Analysis**: Webpack bundle analyzer integration

#### Database Optimizations
- **Indexing**: Strategic indexes on frequently queried columns
- **Query Optimization**: Efficient SQL queries with proper joins
- **Pagination**: Cursor-based pagination for large datasets
- **Caching**: Supabase built-in caching and CDN

#### Network Optimizations
- **CDN**: Netlify CDN for static asset delivery
- **Compression**: Gzip compression for all responses
- **Caching Headers**: Appropriate cache-control headers
- **Lazy Loading**: Component and image lazy loading

### Performance Metrics
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Lighthouse Score**: Target 90+ for all categories
- **API Response Time**: < 200ms for most endpoints
- **Bundle Size**: < 200KB for initial JavaScript load

## 🔒 Security Architecture

### Security Layers

#### Network Security
- **HTTPS Only**: All connections encrypted
- **CORS Configuration**: Proper cross-origin resource sharing
- **Rate Limiting**: API rate limiting to prevent abuse
- **Firewall**: Netlify firewall and DDoS protection

#### Application Security
- **Input Validation**: Zod schemas for all data validation
- **SQL Injection Prevention**: Parameterized queries only
- **XSS Protection**: React's built-in XSS prevention
- **CSRF Protection**: Next.js built-in CSRF protection

#### Data Security
- **Encryption**: Data encrypted at rest and in transit
- **Access Control**: RLS policies for data access
- **Audit Logging**: Comprehensive activity logging
- **Backup Security**: Encrypted database backups

### Security Monitoring
- **Error Tracking**: Sentry integration for error monitoring
- **Security Headers**: OWASP recommended security headers
- **Vulnerability Scanning**: Regular dependency vulnerability checks
- **Access Monitoring**: Login attempt monitoring and alerting

## 📈 Scalability Architecture

### Horizontal Scaling
- **Stateless Design**: No server-side session state
- **CDN Integration**: Global content delivery
- **Database Scaling**: Supabase's built-in scaling capabilities
- **Microservices Ready**: Modular architecture for future splitting

### Performance Scaling
- **Caching Strategy**: Multi-layer caching (CDN, browser, application)
- **Lazy Loading**: Progressive loading of content
- **Image Optimization**: Responsive images with modern formats
- **Code Splitting**: Automatic route-based code splitting

### Monitoring & Analytics
- **Performance Monitoring**: Real user monitoring (RUM)
- **Error Tracking**: Centralized error collection and alerting
- **Usage Analytics**: User behavior and feature usage tracking
- **Business Metrics**: Content engagement and conversion tracking

## 🔄 Development Workflow

### BMAD™ Integration
- **Agent Coordination**: Specialized AI agents for different roles
- **Automated Documentation**: AI-generated comprehensive documentation
- **Quality Gates**: Automated quality checks and validations
- **Workflow Automation**: Streamlined development processes

### CI/CD Pipeline
- **Automated Testing**: Unit, integration, and E2E tests
- **Code Quality**: ESLint, Prettier, and TypeScript checks
- **Security Scanning**: Automated security vulnerability scanning
- **Deployment**: Automated deployment with rollback capabilities

## 📚 Documentation Architecture

### Documentation Organization
```
docs/
├── architecture/           # System architecture docs
│   ├── overview.md        # This document
│   ├── tech-stack.md      # Technology details
│   ├── database-schema.md # Database documentation
│   ├── api-design.md      # API architecture
│   └── components.md      # Component architecture
├── development/           # Development guidelines
├── api/                   # API documentation
├── components/            # Component documentation
└── bmad/                  # BMAD methodology docs
```

### Documentation Standards
- **Markdown Format**: Consistent markdown formatting
- **Code Examples**: Practical, runnable code examples
- **Visual Diagrams**: Architecture diagrams and flowcharts
- **Cross-References**: Internal linking between documents
- **Version Control**: Documentation versioning with code

## 🎯 Future Architecture Considerations

### Planned Enhancements
- **Microservices Migration**: Potential splitting of monolithic app
- **GraphQL API**: More flexible data fetching
- **Real-time Features**: WebSocket integration for live updates
- **Advanced Caching**: Redis integration for improved performance
- **Multi-region Deployment**: Global deployment strategy

### Technology Evolution
- **Framework Updates**: Next.js and React version upgrades
- **Database Evolution**: Potential migration to different database solutions
- **Cloud Services**: Integration with additional cloud services
- **AI Integration**: Enhanced BMAD™ capabilities

---

**This architecture provides a solid foundation for current needs while remaining flexible for future growth and enhancements.**