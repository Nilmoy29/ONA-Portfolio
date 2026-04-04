# Environment Setup

This guide covers the environment configuration required to run the ONA Portfolio Website locally and in production.

## 🔧 Prerequisites

### Required Software
- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **Git**: Version 2.x or higher
- **Supabase CLI**: Version 1.x (optional, for database management)

### System Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 2GB for project and dependencies
- **Operating System**: Windows 10+, macOS 10.15+, or Linux

## 🌍 Environment Variables

### Required Variables

Create a `.env.local` file in the project root with the following variables:



# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Optional: Analytics and Monitoring
NEXT_PUBLIC_GA_TRACKING_ID=
SENTRY_DSN=

# Optional: Email Configuration
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

### Variable Descriptions

#### Supabase Variables
- **`NEXT_PUBLIC_SUPABASE_URL`**: Your Supabase project URL
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Public anonymous key for client-side operations
- **`SUPABASE_SERVICE_ROLE_KEY`**: Secret service role key for server-side operations (keep secure!)

#### Application Variables
- **`NEXT_PUBLIC_APP_URL`**: Base URL of your application
- **`NODE_ENV`**: Environment mode (`development`, `production`, `test`)

#### Optional Variables
- **`NEXT_PUBLIC_GA_TRACKING_ID`**: Google Analytics tracking ID
- **`SENTRY_DSN`**: Sentry error tracking DSN
- **SMTP variables**: Email service configuration for notifications

## 🗄️ Database Setup

### Supabase Project

The project uses Supabase as the backend. The production database is already configured:

- **Project ID**: `oscicdyjpnnykyqpvuys`
- **Region**: Auto-assigned by Supabase
- **Database**: PostgreSQL 15.x

### Local Development Database

For local development, you can either:

1. **Use the production database** (recommended for development)
2. **Set up a local Supabase instance** (advanced)

#### Option 1: Production Database (Recommended)

The provided credentials connect to the production database, which is suitable for development and testing. The database includes:

- **Row Level Security (RLS)** policies for data protection
- **Sample data** for testing and development
- **Admin user accounts** for dashboard access

#### Option 2: Local Supabase (Advanced)

To set up a local Supabase instance:

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize local Supabase
supabase init

# Start local services
supabase start

# Apply database schema
supabase db reset
```

### Database Schema

The database contains 12 core tables with proper relationships:

```sql
-- Content Management Tables
projects           -- Portfolio projects
team_members       -- Team member profiles
services          -- Service offerings
explore_content    -- Articles and research
partners          -- Business partners
categories        -- Content categorization

-- Admin Tables
admin_profiles     -- Admin user management
contact_submissions -- Contact form data
admin_activity_logs -- Audit trail
site_settings     -- Dynamic configuration
```

## 🔐 Authentication Setup

### Admin User Accounts

The database includes pre-configured admin accounts for testing:

- **Default Admin**: Check database seed data or contact project maintainer
- **Role-Based Access**: Admin, Editor, and Viewer roles available

### Authentication Flow

1. **Login**: Users authenticate via `/admin/login`
2. **Session Management**: JWT tokens with automatic refresh
3. **Authorization**: Role-based permissions for different features
4. **Security**: Row Level Security (RLS) policies protect data access

## 🚀 Development Environment

### IDE Configuration

#### Recommended: Cursor or VSCode

**Extensions to install:**
- **TypeScript and JavaScript Language Features** (built-in)
- **Tailwind CSS IntelliSense**
- **Prettier - Code formatter**
- **ESLint**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**

#### BMAD Integration

The project includes BMAD™ methodology integration:

- **Cursor Rules**: `.cursor/rules/bmad/` - IDE-specific agent configurations
- **Claude Commands**: `.claude/commands/BMad/` - AI agent command definitions
- **Core Agents**: `.bmad-core/agents/` - Agent persona definitions

### Development Scripts

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Type checking
npm run type-check

# Run tests
npm run test
```

## 🌐 Production Deployment

### Environment Configuration

For production deployment, create a `.env.production` file:

```env
# Production Supabase (use separate project for production)
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-key

# Production settings
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Analytics and monitoring
NEXT_PUBLIC_GA_TRACKING_ID=GA-XXXXXXXXXX
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### Deployment Platforms

#### Netlify (Recommended)

1. **Connect Repository**: Link your GitHub repository
2. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next`
3. **Environment Variables**: Set production environment variables
4. **Deploy**: Automatic deployments on push to main branch

#### Vercel (Alternative)

1. **Import Project**: Connect GitHub repository
2. **Configure Build**:
   - **Framework**: Next.js
   - **Root Directory**: `./`
3. **Environment Variables**: Configure production variables
4. **Deploy**: Automatic deployments with preview deployments

### Build Optimization

```bash
# Production build with optimizations
npm run build

# Analyze bundle size
npm install -g @next/bundle-analyzer
npm run build:analyze
```

## 🔍 Testing Environment

### Test Database

For testing, consider creating a separate Supabase project or using test-specific tables with prefixes.

### Test Configuration

```env
# Test environment
NODE_ENV=test
NEXT_PUBLIC_SUPABASE_URL=https://test-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-anon-key
SUPABASE_SERVICE_ROLE_KEY=test-service-key
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Test Supabase connection
npx supabase status

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
```

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

#### Authentication Issues
- Verify Supabase keys are correct
- Check user roles in admin_profiles table
- Ensure RLS policies are active

### Debug Mode

Enable debug logging:

```env
DEBUG=true
NEXT_PUBLIC_DEBUG=true
```

## 🔒 Security Considerations

### Environment Variable Security
- Never commit `.env` files to version control
- Use different Supabase projects for dev/staging/production
- Rotate API keys regularly
- Use secret management services for production

### Database Security
- Row Level Security (RLS) is enabled on all tables
- Service role key provides admin access - keep secure
- Regular security audits recommended
- Backup strategies should be implemented

## 📞 Support

### Getting Help
- **Environment Issues**: Check this documentation first
- **Database Problems**: Review Supabase dashboard and logs
- **Build Issues**: Check build logs and error messages
- **Authentication**: Verify user roles and permissions

### Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)

---

**Environment setup complete!** Your development environment is now ready.