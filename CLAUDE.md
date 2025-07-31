# CLAUDE.md - Project Memory & Documentation

## Project Overview
**Office of Native Architects (ONA) Portfolio Website**
- Next.js 14 application with App Router
- TypeScript + Tailwind CSS
- Supabase backend (PostgreSQL + Auth)
- Admin dashboard for content management
- Client-facing portfolio website

## Current Status ✅

### Database Setup
- **Supabase Project**: `oscicdyjpnnykyqpvuys`
- **Database**: PostgreSQL with complete schema
- **Tables**: 12 tables with proper relationships
- **RLS**: Configured with admin authentication
- **Final Setup Script**: `scripts/comprehensive-database-fix-final.sql`

### Admin Dashboard - COMPLETE
**All admin pages fully implemented and working:**

1. **Dashboard** (`/admin/dashboard`) - Stats, activity, quick actions
2. **Projects** (`/admin/projects`) - Full CRUD with categories
3. **Team Members** (`/admin/team`) - Full CRUD with profiles
4. **Services** (`/admin/services`) - Full CRUD with types
5. **Explore Content** (`/admin/explore`) - Articles, artwork, research
6. **Partners** (`/admin/partners`) - Business partners management
7. **Contact** (`/admin/contact`) - Form submissions management
8. **Admin Users** (`/admin/users`) - User management with roles
9. **Media Library** (`/admin/media`) - File management system
10. **Settings** (`/admin/settings`) - Site configuration
11. **Logs** (`/admin/logs`) - Activity tracking

### API Routes - COMPLETE
**All API endpoints implemented:**
- `/api/admin/projects/*` - Projects CRUD
- `/api/admin/team/*` - Team members CRUD
- `/api/admin/services/*` - Services CRUD
- `/api/admin/explore/*` - Content CRUD
- `/api/admin/partners/*` - Partners CRUD
- `/api/admin/contact/*` - Contact submissions
- `/api/admin/users/*` - Admin users CRUD
- `/api/admin/media/*` - Media management
- `/api/admin/categories/*` - Categories CRUD
- `/api/admin/logs/*` - Activity logs

### Authentication System
- **Supabase Auth**: Email/password authentication
- **Admin Profiles**: Role-based access control
- **RLS Policies**: Secure data access
- **Session Management**: Persistent login state
- **Middleware**: Route protection

## Database Schema

### Core Tables
```sql
-- Content Tables
projects (id, title, slug, description, category_id, featured_image_url, gallery_images, client_name, location, project_status, is_published, sort_order)
team_members (id, name, slug, position, bio, profile_image_url, specializations, is_published, sort_order)
services (id, name, slug, description, service_type, icon, featured_image_url, is_published, sort_order)
explore_content (id, title, slug, content_type, content, excerpt, featured_image_url, author_id, is_published)
partners (id, name, slug, description, logo_url, website_url, is_published, sort_order)
categories (id, name, slug, description, color, sort_order)

-- Admin Tables
admin_profiles (id, user_id, full_name, role, permissions, is_active, last_login, avatar_url)
admin_activity_logs (id, user_id, action, entity_type, entity_id, details)
contact_submissions (id, name, email, subject, message, status, is_read, admin_notes)
site_settings (id, key, value, description, data_type, category, is_public)

-- Junction Tables
project_partners (project_id, partner_id)
project_team_members (project_id, team_member_id)
```

### Key Fields & Relationships
- All tables have UUID primary keys
- `created_at` and `updated_at` timestamps
- `is_published` boolean for content visibility
- `sort_order` integer for display ordering
- JSON fields for flexible data (gallery_images, permissions, etc.)

## API Endpoints Structure

### Standard CRUD Pattern
```
GET    /api/admin/{entity}        - List with pagination/filtering
POST   /api/admin/{entity}        - Create new record
GET    /api/admin/{entity}/[id]   - Get single record
PUT    /api/admin/{entity}/[id]   - Update record
DELETE /api/admin/{entity}/[id]   - Delete record
```

### Response Format
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://oscicdyjpnnykyqpvuys.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## File Structure

### Admin Dashboard
```
app/admin/
├── layout.tsx                 - Main admin layout
├── dashboard/page.tsx         - Dashboard overview
├── projects/
│   ├── page.tsx              - Projects list
│   ├── new/page.tsx          - Create project
│   └── [id]/edit/page.tsx    - Edit project
├── team/
│   ├── page.tsx              - Team list
│   ├── new/page.tsx          - Create member
│   └── [id]/edit/page.tsx    - Edit member
├── services/
│   ├── page.tsx              - Services list
│   ├── new/page.tsx          - Create service
│   └── [id]/edit/page.tsx    - Edit service
├── explore/
│   ├── page.tsx              - Content list
│   ├── new/page.tsx          - Create content
│   └── [id]/edit/page.tsx    - Edit content
├── partners/
│   ├── page.tsx              - Partners list
│   ├── new/page.tsx          - Create partner
│   └── [id]/edit/page.tsx    - Edit partner
├── contact/page.tsx          - Contact submissions
├── users/page.tsx            - Admin users
├── media/page.tsx            - Media library
├── settings/page.tsx         - Site settings
└── logs/page.tsx             - Activity logs
```

### Components
```
components/admin/
├── admin-sidebar.tsx         - Navigation sidebar
├── admin-header.tsx          - Top header
├── simple-admin-layout.tsx   - Layout wrapper
├── project-form.tsx          - Project create/edit form
├── team-member-form.tsx      - Team member form
├── service-form.tsx          - Service form
├── content-form.tsx          - Content form
├── partner-form.tsx          - Partner form
├── image-upload.tsx          - Image upload component
└── media-manager.tsx         - Media management
```

## Critical Implementation Details

### Partners Schema Issue ⚠️
The Partners API was designed with extended fields that don't exist in the database:
- API expects: `partner_type`, `contact_name`, `contact_email`, `contact_phone`, `established_year`, `specialization`, `company_size`, `portfolio_images`, `is_active`, `is_featured`
- Database has: `name`, `slug`, `description`, `logo_url`, `website_url`, `is_published`, `sort_order`

**Resolution**: Use existing database schema fields and update forms accordingly.

### Admin Users Schema
- Database uses `full_name` not `name`
- Database uses `user_id` as foreign key to auth.users
- Additional fields: `role`, `permissions`, `is_active`, `last_login`

### Media Library
- Currently uses mock data for development
- Real implementation would need:
  - Supabase Storage integration
  - Media files table in database
  - File upload handling

## Authentication Flow

### Admin Login
1. User enters credentials at `/admin/login`
2. Supabase Auth validates credentials
3. Check if user has admin profile in `admin_profiles`
4. Set session and redirect to dashboard
5. Middleware protects all `/admin/*` routes

### Permissions System
```json
{
  "can_manage_users": true,
  "can_manage_content": true,
  "can_manage_settings": true,
  "can_view_analytics": true,
  "can_manage_partners": true,
  "can_manage_projects": true,
  "can_manage_team": true,
  "can_manage_services": true,
  "can_manage_explore": true
}
```

## Common Operations

### Creating New Content
1. Navigate to relevant admin section
2. Click "Add New" button
3. Fill out form with required fields
4. Set publication status
5. Submit and redirect to list view

### Editing Content
1. Click "Edit" from list view
2. Form pre-populated with existing data
3. Modify fields as needed
4. Update and redirect to list view

### Deleting Content
1. Click "Delete" from dropdown menu
2. Confirm deletion in alert dialog
3. Record removed from database
4. List view refreshes

## Recent Cleanup (July 18, 2025)

### Removed Files
- All backup files (*-backup.*, *-fixed.*, *.bak)
- Test directories and files (test*, *-test.*)
- Redundant documentation files
- Duplicate SQL scripts
- Development scripts and utilities

### Kept Files
- `scripts/comprehensive-database-fix-final.sql` - Final database setup
- `scripts/sample-data.sql` - Sample data for development
- `ADMIN_DASHBOARD_SETUP_COMPLETE.md` - Setup completion documentation
- `DATABASE_SETUP_INSTRUCTIONS.md` - Database setup guide
- `SUPABASE_DATABASE_DOCUMENTATION.md` - Database documentation
- `Readme.md` - Project documentation

## Development Notes

### Working Features ✅
- Complete admin dashboard with all CRUD operations
- Authentication and authorization
- Database integration with Supabase
- Image upload and gallery management
- Role-based permissions
- Activity logging
- Responsive design

### Known Issues ⚠️
1. **Partners API** - Field mismatch with database schema
2. **Media Library** - Uses mock data, needs real storage integration
3. **Admin Users** - Field name mismatch (`name` vs `full_name`)

### Next Steps
1. Fix Partners API to match database schema
2. Implement real media storage with Supabase Storage
3. Fix Admin Users field mapping
4. Add client-facing website pages
5. Implement SEO optimization
6. Add analytics and reporting

## Quick Commands

### Database Reset
```bash
# Apply final database schema
supabase db reset --linked
# Or run SQL directly
psql -h [host] -U [user] -d [database] -f scripts/comprehensive-database-fix-final.sql
```

### Development Server
```bash
npm run dev
# Admin dashboard: http://localhost:3000/admin
# Login: admin@ona.com / password123
```

### Build Production
```bash
npm run build
npm run start
```

## Support Information

### Supabase Dashboard
- URL: https://supabase.com/dashboard/project/oscicdyjpnnykyqpvuys
- Database: PostgreSQL 15.x
- Storage: Not configured (for media files)
- Auth: Email/password enabled

### Admin Access
- Login URL: `/admin/login`
- Demo credentials in database
- Full admin permissions by default

---

**Last Updated**: July 18, 2025
**Status**: Admin dashboard complete, ready for client website development
**Next Priority**: Fix API schema mismatches and implement real media storage