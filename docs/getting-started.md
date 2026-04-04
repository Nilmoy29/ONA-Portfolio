# Getting Started

Welcome to the **Office of Native Architects (ONA) Portfolio Website** project! This guide will help you get up and running quickly.

## 🎯 Project Overview

The ONA Portfolio Website is a comprehensive platform featuring:

- **Next.js 14** application with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Supabase** backend with PostgreSQL
- **Admin Dashboard** for content management
- **Client-Facing Website** for portfolio display

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Git** for version control
- **Supabase CLI** (optional, for database management)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ona-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   Configure your environment variables (see [Environment Setup](./environment-setup.md))

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - **Website**: http://localhost:3000
   - **Admin Dashboard**: http://localhost:3000/admin

## 📊 Current Project Status

### ✅ Completed Features

#### Database & Backend
- **Supabase Integration**: Complete PostgreSQL database setup
- **12 Core Tables**: Projects, team members, services, admin users, etc.
- **Row Level Security (RLS)**: Configured for all tables
- **Authentication System**: Email/password with role-based access

#### Admin Dashboard
- **Complete CRUD Operations**: Create, read, update, delete for all content types
- **Content Management**: Projects, team members, services, explore content, partners
- **User Management**: Admin user creation and role management
- **Media Management**: File upload and organization (framework ready)
- **Activity Logging**: Comprehensive audit trail

#### API Layer
- **RESTful Endpoints**: 40+ API routes implemented
- **Data Validation**: Type-safe API responses
- **Error Handling**: Comprehensive error management
- **Pagination**: Efficient data loading for large datasets

#### Frontend
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Architecture**: Reusable, modular components
- **Performance Optimized**: Next.js App Router with optimizations
- **SEO Ready**: Meta tags and structured data

### 🚧 Current Development Focus

- **Documentation Consolidation**: Organizing scattered documentation
- **Media Storage Integration**: Real Supabase Storage implementation
- **Client Website Completion**: Projects, team, and services pages
- **SEO Optimization**: Search engine optimization and performance

### 📋 Upcoming Tasks

- [ ] Implement Supabase Storage for media files
- [ ] Complete client-facing website pages
- [ ] Add analytics and reporting features
- [ ] Performance optimization and caching
- [ ] Security hardening and penetration testing

## 🏗️ System Architecture

### Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Framework** | Next.js | 14.x | React framework with App Router |
| **Language** | TypeScript | 5.x | Type-safe JavaScript |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS framework |
| **Database** | Supabase (PostgreSQL) | - | Backend database and auth |
| **Deployment** | Netlify | - | Static site hosting |
| **Development** | BMAD™ | - | Project management methodology |

### Database Schema

The system uses 12 core tables:

- **`projects`** - Portfolio projects with categories and media
- **`team_members`** - Team member profiles and specializations
- **`services`** - Service offerings with types and descriptions
- **`explore_content`** - Articles, artwork, and research content
- **`partners`** - Business partners and collaborations
- **`categories`** - Content categorization system
- **`admin_profiles`** - Admin user management with roles
- **`contact_submissions`** - Contact form data and management
- **`site_settings`** - Dynamic site configuration
- **`admin_activity_logs`** - Audit trail and activity tracking

### Application Structure

```
ona-portfolio/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   └── (public)/          # Client-facing pages
├── components/            # Reusable React components
├── lib/                   # Utility functions and configurations
├── styles/                # Global styles and Tailwind config
├── docs/                  # Documentation (organized)
└── .bmad-core/           # BMAD methodology system
```

## 👥 Development Workflow

This project uses the **BMAD™ (Business Management and Development)** methodology:

### Available Agents
- **🎯 Sarah (Product Owner)**: Requirements and backlog management
- **🏗️ Architect**: System design and technical specifications
- **👨‍💻 Developer**: Code implementation and refactoring
- **🧪 QA Engineer**: Testing and quality assurance
- **📊 Analyst**: Business analysis and data requirements

### Development Process
1. **Planning**: Product Owner defines requirements and user stories
2. **Design**: Architect creates technical specifications
3. **Implementation**: Developer builds features following standards
4. **Quality Assurance**: QA validates implementation and runs tests
5. **Deployment**: Automated deployment with monitoring

## 🔧 Development Commands

### Core Commands
```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # TypeScript validation

# Database
npm run db:reset        # Reset database with schema
npm run db:seed         # Populate with sample data

# Quality Assurance
npm run test           # Run test suite
npm run test:watch     # Run tests in watch mode
```

### BMAD Agent Commands
```bash
# Activate agents (when using BMAD integration)
*po                     # Activate Product Owner (Sarah)
*architect            # Activate Architect
*dev                  # Activate Developer
*qa                   # Activate QA Engineer
```

## 🔐 Authentication & Access

### Admin Access
- **URL**: `/admin/login`
- **Demo Credentials**: Available in database seed data
- **Role-Based Access**: Admin, Editor, Viewer permissions
- **Session Management**: Secure JWT-based authentication

### Environment Variables
Required environment variables for full functionality:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 📚 Documentation Structure

### Organized Documentation
```
docs/
├── getting-started.md          # This guide
├── development-setup.md        # Detailed setup instructions
├── environment-setup.md        # Environment configuration
├── architecture/              # System architecture docs
├── development/              # Development guidelines
├── admin/                    # Admin dashboard guides
├── api/                      # API documentation
├── components/               # Component library
├── bmad/                     # BMAD methodology docs
└── troubleshooting.md        # Common issues and solutions
```

### Key Resources
- **[Database Documentation](./architecture/database-schema.md)**: Complete schema and relationships
- **[API Reference](./api/README.md)**: All available endpoints
- **[Component Library](./components/README.md)**: Reusable components
- **[BMAD Methodology](./bmad/overview.md)**: Development process and agents

## 🐛 Common Issues & Solutions

### Database Connection Issues
- Verify Supabase credentials in `.env.local`
- Check database status in Supabase dashboard
- Ensure RLS policies are configured correctly

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`
- Verify environment variables are set correctly

### Admin Dashboard Issues
- Check user permissions and roles
- Verify API endpoints are responding
- Check browser console for JavaScript errors

## 📞 Support & Resources

### Getting Help
- **Documentation**: Check organized docs in `docs/` directory
- **Issues**: Create GitHub issues for bugs/features
- **Discussions**: Use GitHub discussions for questions
- **BMAD Agents**: Use integrated AI agents for guidance

### Community Resources
- **Next.js Documentation**: https://nextjs.org/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs

## 🎯 Next Steps

Now that you're set up, here are recommended next steps:

1. **Explore the Admin Dashboard**: Log in and explore content management features
2. **Review the Architecture**: Understand the system design and data flow
3. **Check Out Components**: Familiarize yourself with the component library
4. **Run the Development Workflow**: Try creating or editing some content
5. **Set Up Your Development Environment**: Configure your preferred IDE and tools

---

**Happy coding!** 🎉 Welcome to the ONA Portfolio Website project.