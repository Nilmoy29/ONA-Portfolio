# Database Schema Documentation

## 📊 Overview

The ONA Portfolio Website uses **Supabase** (PostgreSQL) as its primary database with a comprehensive schema supporting content management, user administration, and system operations.

- **Database ID**: `oscicdyjpnnykyqpvuys`
- **Total Tables**: 12 core tables
- **Architecture**: Relational with JSON fields for flexibility
- **Security**: Row Level Security (RLS) policies on all tables

## 🏗️ Core Tables

### Content Management Tables

#### `projects`
Portfolio project management with full content and media support.

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  featured_image_url TEXT,
  gallery_images JSONB, -- Array of image URLs with metadata
  client_name VARCHAR(255),
  location VARCHAR(255),
  project_status VARCHAR(50) DEFAULT 'draft',
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key Features:**
- UUID primary keys for security
- Unique slugs for URL generation
- JSONB for flexible gallery images
- Category relationships
- Publication workflow support

#### `team_members`
Team member profiles with specialization tracking.

```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  position VARCHAR(255),
  bio TEXT,
  profile_image_url TEXT,
  specializations JSONB, -- Array of specialization areas
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `services`
Service offerings with categorization and media.

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  service_type VARCHAR(100),
  icon VARCHAR(100), -- Icon identifier/class
  featured_image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `explore_content`
Articles, artwork, and research content.

```sql
CREATE TABLE explore_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content_type VARCHAR(50) NOT NULL, -- 'article', 'artwork', 'research'
  content TEXT,
  excerpt TEXT,
  featured_image_url TEXT,
  author_id UUID REFERENCES admin_profiles(id),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `partners`
Business partners and collaborators.

```sql
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `categories`
Content categorization system.

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7), -- Hex color code for UI
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Administration Tables

#### `admin_profiles`
Admin user management with role-based access.

```sql
CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'editor', -- 'admin', 'editor', 'viewer'
  permissions JSONB, -- Granular permissions object
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Roles & Permissions:**
- **Admin**: Full access to all features
- **Editor**: Content creation and editing
- **Viewer**: Read-only access

#### `admin_activity_logs`
Comprehensive audit trail for all admin actions.

```sql
CREATE TABLE admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES admin_profiles(id),
  action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'login', etc.
  entity_type VARCHAR(50) NOT NULL, -- 'project', 'team_member', etc.
  entity_id UUID, -- Reference to the affected entity
  details JSONB, -- Additional action details
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `contact_submissions`
Contact form submissions with admin management.

```sql
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread', -- 'unread', 'read', 'responded', 'archived'
  is_read BOOLEAN DEFAULT false,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `site_settings`
Dynamic site configuration management.

```sql
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  data_type VARCHAR(50) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
  category VARCHAR(100), -- Grouping for UI organization
  is_public BOOLEAN DEFAULT false, -- Whether clients can access
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Junction Tables

#### `project_partners`
Many-to-many relationship between projects and partners.

```sql
CREATE TABLE project_partners (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (project_id, partner_id)
);
```

#### `project_team_members`
Many-to-many relationship between projects and team members.

```sql
CREATE TABLE project_team_members (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  team_member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (project_id, team_member_id)
);
```

## 🔗 Relationships & Constraints

### Foreign Key Relationships
```
projects.category_id → categories.id
explore_content.author_id → admin_profiles.id
admin_profiles.user_id → auth.users.id (Supabase Auth)
project_partners.project_id → projects.id
project_partners.partner_id → partners.id
project_team_members.project_id → projects.id
project_team_members.team_member_id → team_members.id
```

### Unique Constraints
- All slug fields are unique for URL generation
- User emails are handled by Supabase Auth
- Junction tables prevent duplicate relationships

### Data Integrity
- CASCADE deletes for junction tables
- UUID primary keys for security
- NOT NULL constraints on required fields
- Automatic timestamps with time zones

## 🔒 Security Model

### Row Level Security (RLS)

All tables have RLS enabled with policies based on:

#### Public Content Access
```sql
-- Allow public read access to published content
CREATE POLICY "Public read access for published content"
ON projects FOR SELECT
USING (is_published = true);
```

#### Admin-Only Access
```sql
-- Admin users can perform all operations
CREATE POLICY "Admin full access"
ON projects FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'editor')
  )
);
```

#### User-Specific Access
```sql
-- Users can only see their own contact submissions
CREATE POLICY "Users can view own contact submissions"
ON contact_submissions FOR SELECT
USING (auth.jwt() ->> 'email' = email);
```

### Authentication Integration
- Supabase Auth handles user registration and login
- JWT tokens contain user identity
- RLS policies use `auth.uid()` and `auth.jwt()` functions
- Automatic session management

## 📊 Indexes & Performance

### Automatic Indexes
- Primary key indexes on all tables
- Foreign key indexes for referential integrity
- Unique indexes on slug fields

### Recommended Additional Indexes
```sql
-- For content filtering
CREATE INDEX idx_projects_published ON projects(is_published, sort_order);
CREATE INDEX idx_projects_category ON projects(category_id, is_published);
CREATE INDEX idx_team_members_published ON team_members(is_published, sort_order);
CREATE INDEX idx_services_published ON services(is_published, sort_order);

-- For search functionality
CREATE INDEX idx_projects_title ON projects USING gin(to_tsvector('english', title));
CREATE INDEX idx_explore_content_title ON explore_content USING gin(to_tsvector('english', title));

-- For admin activity logs
CREATE INDEX idx_activity_logs_user ON admin_activity_logs(user_id, created_at);
CREATE INDEX idx_activity_logs_entity ON admin_activity_logs(entity_type, entity_id);
```

## 🔄 Data Types & Validation

### JSONB Fields Usage
- `gallery_images`: Array of image objects with metadata
- `specializations`: Array of specialization strings
- `permissions`: Object with granular permission flags
- `details`: Flexible metadata for activity logs

### Validation Rules
- Slug fields: lowercase, URL-safe strings
- Email fields: proper email format validation
- Sort order: non-negative integers
- Status fields: controlled vocabularies

## 🛠️ Maintenance & Operations

### Backup Strategy
- Daily automated backups via Supabase
- Point-in-time recovery available
- Schema versioning with migration scripts

### Monitoring
- Query performance monitoring
- Storage usage tracking
- Error logging and alerting
- User activity analytics

### Migration Scripts
Located in `scripts/` directory:
- `comprehensive-database-fix-final.sql` - Complete schema setup
- `sample-data.sql` - Development sample data
- Various maintenance and fix scripts

## 🚀 Scaling Considerations

### Current Limitations
- Single Supabase project (suitable for current scale)
- No database sharding required yet
- JSONB fields provide flexibility for future extensions

### Future Scaling
- Database replication for read-heavy operations
- CDN integration for media assets
- Caching layers for frequently accessed content
- Multi-region deployment support

## 📋 Development Notes

### Schema Evolution
- Use migration scripts for schema changes
- Maintain backward compatibility
- Update RLS policies for new access patterns
- Document all schema changes

### Testing
- Use sample data for development testing
- Test RLS policies with different user roles
- Validate foreign key constraints
- Performance test with realistic data volumes

---

**Database Schema Version**: Final (July 2025)
**Last Updated**: January 2026