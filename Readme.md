# ONA Portfolio Website

**Office of Native Architects (ONA) Portfolio Website** - A comprehensive portfolio platform built with modern web technologies.

[![Next.js](https://img.shields.io/badge/Next.js-14.0+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)](https://supabase.com/)

## 📋 Table of Contents

### 🚀 Quick Start
- [Getting Started](./docs/getting-started.md)
- [Development Setup](./docs/development-setup.md)
- [Environment Configuration](./docs/environment-setup.md)

### 🏗️ Architecture & Development
- [System Architecture](./docs/architecture/)
  - [Overview](./docs/architecture/overview.md)
  - [Tech Stack](./docs/architecture/tech-stack.md)
  - [Database Schema](./docs/architecture/database-schema.md)
  - [API Design](./docs/architecture/api-design.md)
  - [Component Architecture](./docs/architecture/components.md)
- [Development Guidelines](./docs/development/)
  - [Coding Standards](./docs/development/coding-standards.md)
  - [Testing Strategy](./docs/development/testing.md)
  - [Deployment Guide](./docs/development/deployment.md)

### 📚 BMAD Methodology
- [BMAD Overview](./docs/bmad/overview.md)
- [Agents & Roles](./docs/bmad/agents/)
- [Workflows](./docs/bmad/workflows/)
- [Templates](./docs/bmad/templates/)
- [Checklists](./docs/bmad/checklists/)

### 🔧 Administration
- [Admin Dashboard](./docs/admin/)
  - [User Guide](./docs/admin/dashboard-guide.md)
  - [Content Management](./docs/admin/content-management.md)
  - [Media Library](./docs/admin/media-management.md)
- [Database Administration](./docs/admin/database-admin.md)

### 📖 Reference
- [API Documentation](./docs/api/)
- [Component Library](./docs/components/)
- [Troubleshooting](./docs/troubleshooting.md)
- [Contributing](./docs/contributing.md)

## 🎯 Project Status

### ✅ Completed Features
- **Admin Dashboard**: Complete CRUD operations for all content types
- **Database**: Full PostgreSQL schema with Supabase integration
- **Authentication**: Role-based access control system
- **API Layer**: RESTful endpoints for all operations
- **Frontend**: Responsive portfolio website with modern UI

### 🚧 Current Focus
- Documentation consolidation and organization
- Client-facing website optimization
- Media storage integration

### 📋 Next Steps
- [ ] Implement real media storage with Supabase Storage
- [ ] Add client website pages (projects, team, services)
- [ ] SEO optimization and performance tuning
- [ ] Analytics and reporting features

## 🛠️ Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Frontend** | Next.js | 14+ | React framework with App Router |
| **Language** | TypeScript | 5.0+ | Type-safe JavaScript |
| **Styling** | Tailwind CSS | 3.0+ | Utility-first CSS framework |
| **Backend** | Supabase | - | PostgreSQL database + Auth |
| **Database** | PostgreSQL | - | Primary data storage |
| **Deployment** | Netlify | - | Static site hosting |
| **Development** | BMAD™ | - | Project management methodology |

## 🚀 Quick Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:reset        # Reset database with schema
npm run db:seed         # Seed with sample data

# Quality Assurance
npm run lint            # Run ESLint
npm run test            # Run tests
npm run type-check      # TypeScript validation
```

## 📊 Database

- **Supabase Project ID**: `oscicdyjpnnykyqpvuys`
- **Tables**: 12 core tables with relationships
- **Authentication**: Email/password with role-based access
- **RLS**: Row Level Security configured for all tables

**Key Tables:**
- `projects` - Portfolio projects with categories
- `team_members` - Team member profiles
- `services` - Service offerings
- `admin_profiles` - Admin user management
- `contact_submissions` - Contact form data

## 👥 Team & Roles

This project uses the **BMAD™ (Business Management and Development)** methodology with specialized AI agents:

- **🎯 Product Owner (Sarah)**: Requirements validation and backlog management
- **🏗️ Architect**: System design and technical architecture
- **👨‍💻 Developer**: Implementation and coding
- **🧪 QA Engineer**: Testing and quality assurance
- **📊 Analyst**: Data analysis and insights
- **🎨 UX Expert**: User experience design
- **📋 Project Manager**: Timeline and resource management
- **🤝 Scrum Master**: Process facilitation

## 📞 Support & Contact

- **Admin Access**: `/admin/login`
- **Demo Credentials**: Available in database
- **Documentation**: See [docs/](./docs/) directory
- **Issues**: Create GitHub issues for bugs/features

## 📝 Development Workflow

1. **Planning**: Use BMAD agents for requirement analysis
2. **Design**: Create architecture and UI specifications
3. **Implementation**: Follow coding standards and patterns
4. **Testing**: Comprehensive testing with QA checklists
5. **Deployment**: Automated deployment with Netlify

## 🔒 Security

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Role-based permissions system
- **Data Protection**: Row Level Security (RLS) policies
- **API Security**: Protected routes with middleware

## 📈 Performance

- **Frontend**: Optimized Next.js with App Router
- **Assets**: Image optimization and lazy loading
- **Database**: Indexed queries with efficient pagination
- **Caching**: Strategic caching for improved performance

---

**Built with ❤️ using BMAD™ methodology**

*Last updated: January 2026*