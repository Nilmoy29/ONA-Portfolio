# ONA Portfolio - Supabase Database Documentation

## 📋 Database Overview

**Project:** ONA (Office of Native Architects)  
**Database ID:** `oscicdyjpnnykyqpvuys`  
**Database URL:** `https://oscicdyjpnnykyqpvuys.supabase.co`  
**Region:** Auto-assigned by Supabase  
**Database Type:** PostgreSQL (Supabase managed)

---

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://oscicdyjpnnykyqpvuys.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY2ljZHlqcG5ueWt5cXB2dXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjE3OTcsImV4cCI6MjA2NzkzNzc5N30.IJrRjFZqKHejoM0GS6y0l50OXDmsoJRhVXINixJyB8E
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY2ljZHlqcG5ueWt5cXB2dXlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM2MTc5NywiZXhwIjoyMDY3OTM3Nzk3fQ.RFGdVve9Gq9I19YKsDSBmKIFSEJDi0141l5JkbkFQgI
```

### Client Configuration
- **Client Library:** `@supabase/supabase-js` v2.51.0
- **Authentication:** JWT-based with Supabase Auth
- **Connection:** Configured in `lib/supabase.ts`

---

## 📊 Database Schema

### **Table Structure Overview**

| Table Name | Status | Records | Purpose |
|------------|--------|---------|---------|
| `projects` | ✅ Active | 0 | Architectural projects portfolio |
| `team_members` | ✅ Active | 0 | Team member profiles |
| `services` | ✅ Active | 5 | Service offerings |
| `explore_content` | ✅ Active | 0 | Articles, artwork, research content |
| `partners` | ✅ Active | 0 | Client and partner information |
| `categories` | ✅ Active | 5 | Content categorization |
| `contact_submissions` | ✅ Active | 0 | Contact form submissions |
| `admin_profiles` | ✅ Active | 0 | Admin user profiles |
| `project_partners` | ✅ Active | 0 | Project-partner relationships |
| `project_team_members` | ✅ Active | 0 | Project team assignments |
| `admin_activity_logs` | ✅ Active | 0 | Admin action audit trail |
| `site_settings` | ✅ Active | 12 | Site configuration |

---

## 🏗️ Detailed Table Schemas

### **1. services**
**Purpose:** Store service offerings and descriptions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PRIMARY KEY | Unique service identifier |
| `name` | varchar | NOT NULL | Service name |
| `slug` | varchar | NOT NULL, UNIQUE | URL-friendly identifier |
| `description` | text | NOT NULL | Short description |
| `long_description` | text | NULL | Detailed description |
| `service_type` | varchar | NOT NULL | Service category |
| `icon` | varchar | NULL | Icon identifier |
| `featured_image_url` | varchar | NULL | Main image URL |
| `gallery_images` | json | DEFAULT '[]' | Array of image URLs |
| `is_published` | boolean | DEFAULT true | Publication status |
| `sort_order` | integer | DEFAULT 0 | Display order |
| `created_at` | timestamp | DEFAULT now() | Creation timestamp |
| `updated_at` | timestamp | DEFAULT now() | Last update timestamp |

**Sample Data:**
```json
[
  {
    "id": "929a97ec-cfad-4910-9d12-984e3c41e454",
    "name": "Architectural Design",
    "slug": "architectural-design",
    "description": "Complete architectural design services from concept to completion",
    "service_type": "design",
    "icon": "building",
    "is_published": true,
    "sort_order": 1
  },
  {
    "id": "2a275271-ec33-48e6-bc1b-663b052f9fea",
    "name": "Interior Design",
    "slug": "interior-design",
    "description": "Interior space planning and design",
    "service_type": "design",
    "icon": "home",
    "is_published": true,
    "sort_order": 2
  }
]
```

### **2. categories**
**Purpose:** Categorize projects and content

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PRIMARY KEY | Unique category identifier |
| `name` | varchar | NOT NULL | Category name |
| `slug` | varchar | NOT NULL, UNIQUE | URL-friendly identifier |
| `description` | text | NULL | Category description |
| `color` | varchar | NULL | Display color (hex) |
| `sort_order` | integer | DEFAULT 0 | Display order |
| `created_at` | timestamp | DEFAULT now() | Creation timestamp |
| `updated_at` | timestamp | DEFAULT now() | Last update timestamp |

**Sample Data:**
```json
[
  {
    "id": "cbbf5896-a109-46ef-b326-2fc37d731644",
    "name": "Residential",
    "slug": "residential",
    "description": "Residential architecture projects",
    "color": "#3B82F6",
    "sort_order": 0
  },
  {
    "id": "901360b9-34c8-471f-af88-119bd3c7a6c4",
    "name": "Commercial",
    "slug": "commercial",
    "description": "Commercial and office buildings",
    "color": "#10B981",
    "sort_order": 0
  }
]
```

### **3. site_settings**
**Purpose:** Store site-wide configuration and content

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PRIMARY KEY | Unique setting identifier |
| `key` | varchar | NOT NULL, UNIQUE | Setting key |
| `value` | text | NOT NULL | Setting value |
| `description` | text | NULL | Setting description |
| `data_type` | varchar | NOT NULL | Data type (string, number, boolean) |
| `category` | varchar | NOT NULL | Setting category |
| `is_public` | boolean | DEFAULT true | Public accessibility |
| `created_at` | timestamp | DEFAULT now() | Creation timestamp |
| `updated_at` | timestamp | DEFAULT now() | Last update timestamp |

**Sample Configuration:**
```json
{
  "site_title": "Office of Native Architects",
  "site_description": "Modern architectural practice focused on effectuality, integrity, efficiency, and coexistence",
  "contact_email": "info@ona.com",
  "contact_phone": "+1-555-0123",
  "office_address": "123 Architecture Street, Design City, DC 12345",
  "social_linkedin": "https://linkedin.com/company/ona",
  "social_instagram": "https://instagram.com/ona_architects",
  "social_twitter": "https://twitter.com/ona_architects",
  "homepage_hero_title": "Designing the Future",
  "homepage_hero_subtitle": "Architecture rooted in effectuality, integrity, efficiency, and coexistence",
  "projects_per_page": "12",
  "enable_contact_form": "true"
}
```

### **4. projects (Empty - Schema Inferred)**
**Purpose:** Store architectural project information

*Expected Structure:*
- `id` (uuid, PRIMARY KEY)
- `title` (varchar, NOT NULL)
- `slug` (varchar, NOT NULL, UNIQUE)
- `description` (text)
- `long_description` (text)
- `category_id` (uuid, FOREIGN KEY → categories.id)
- `featured_image_url` (varchar)
- `gallery_images` (json)
- `project_type` (varchar)
- `client_name` (varchar)
- `location` (varchar)
- `completion_date` (date)
- `project_status` (varchar)
- `is_published` (boolean)
- `sort_order` (integer)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### **5. team_members (Empty - Schema Inferred)**
**Purpose:** Store team member profiles

*Expected Structure:*
- `id` (uuid, PRIMARY KEY)
- `name` (varchar, NOT NULL)
- `slug` (varchar, NOT NULL, UNIQUE)
- `position` (varchar)
- `bio` (text)
- `profile_image_url` (varchar)
- `email` (varchar)
- `phone` (varchar)
- `specializations` (json)
- `is_published` (boolean)
- `sort_order` (integer)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### **6. explore_content (Empty - Schema Inferred)**
**Purpose:** Store articles, artwork, and research content

*Expected Structure:*
- `id` (uuid, PRIMARY KEY)
- `title` (varchar, NOT NULL)
- `slug` (varchar, NOT NULL, UNIQUE)
- `content_type` (varchar) // 'article', 'artwork', 'research', 'photography'
- `content` (text)
- `excerpt` (text)
- `featured_image_url` (varchar)
- `gallery_images` (json)
- `author_id` (uuid, FOREIGN KEY → team_members.id)
- `is_published` (boolean)
- `published_at` (timestamp)
- `created_at` (timestamp)
- `updated_at` (timestamp)

---

## 🔒 Security & Access Control

### **Authentication Status**
- **Users Created:** ✅ Admin user configured
- **Auth Provider:** Supabase Auth
- **Session Management:** JWT-based
- **Password Policy:** Default Supabase settings

### **Row Level Security (RLS)**
**Status:** ✅ Custom RLS policies implemented and active
- **Helper functions:** `is_admin()` and `get_admin_profile()` created
- **Admin policies:** Proper access control for admin operations
- **Public policies:** Read access for published content

**Expected RLS Strategy:**
- **Public tables:** `services`, `categories`, `site_settings` (where `is_public = true`)
- **Protected tables:** `projects`, `team_members`, `explore_content` (published content only)
- **Admin-only tables:** `admin_profiles`, `admin_activity_logs`, `contact_submissions`

### **API Access**
- **Anonymous Access:** Read-only access to published content
- **Authenticated Access:** Based on user roles and permissions
- **Service Role:** Full database access (admin operations)

---

## 💾 Storage Configuration

### **Storage Buckets**
**Status:** No storage buckets configured

**Recommended Buckets:**
- `project-images` - Project gallery images
- `team-photos` - Team member profile photos
- `explore-media` - Explore content media files
- `site-assets` - General site assets and logos

---

## 📈 Performance & Optimization

### **Database Metrics**
- **Total Tables:** 12
- **Active Records:** 22 (5 services + 5 categories + 12 settings)
- **Storage Usage:** Minimal (new database)
- **Connection Pooling:** Supabase managed

### **Indexing Strategy**
**Current Indexes:** Default primary key indexes
**Recommended Indexes:**
- `projects.slug` (unique)
- `projects.is_published`
- `projects.category_id`
- `team_members.slug` (unique)
- `team_members.is_published`
- `explore_content.slug` (unique)
- `explore_content.content_type`
- `explore_content.is_published`

---

## 🔄 Data Relationships

### **Core Relationships**
```mermaid
erDiagram
    categories ||--o{ projects : "categorizes"
    team_members ||--o{ project_team_members : "assigned to"
    projects ||--o{ project_team_members : "has members"
    projects ||--o{ project_partners : "has partners"
    partners ||--o{ project_partners : "works on"
    team_members ||--o{ explore_content : "authors"
    admin_profiles ||--o{ admin_activity_logs : "performs"
```

### **Expected Foreign Keys**
- `projects.category_id` → `categories.id`
- `explore_content.author_id` → `team_members.id`
- `project_team_members.project_id` → `projects.id`
- `project_team_members.team_member_id` → `team_members.id`
- `project_partners.project_id` → `projects.id`
- `project_partners.partner_id` → `partners.id`

---

## 🚀 Development Recommendations

### **Completed Actions**
1. ✅ **RLS policies configured** for data security
2. ✅ **Database indexes created** for performance
3. ✅ **Admin user configured** and functional
4. ✅ **Helper functions implemented** for authentication

### **Data Population Strategy**
1. **Services:** ✅ Already populated (5 services)
2. **Categories:** ✅ Already populated (5 categories)
3. **Site Settings:** ✅ Already configured (12 settings)
4. **Projects:** Add sample architectural projects
5. **Team Members:** Add ONA team profiles
6. **Explore Content:** Add sample articles/artwork

### **TypeScript Integration**
- Generate TypeScript types from schema
- Create type-safe database queries
- Implement proper error handling
- Add validation schemas

---

## 📝 API Usage Examples

### **Fetching Services**
```typescript
const { data: services, error } = await supabase
  .from('services')
  .select('*')
  .eq('is_published', true)
  .order('sort_order');
```

### **Fetching Categories**
```typescript
const { data: categories, error } = await supabase
  .from('categories')
  .select('*')
  .order('sort_order');
```

### **Fetching Site Settings**
```typescript
const { data: settings, error } = await supabase
  .from('site_settings')
  .select('key, value')
  .eq('is_public', true);
```

---

## 🔍 Monitoring & Maintenance

### **Health Checks**
- **Database Status:** ✅ Operational
- **API Endpoints:** ✅ Accessible
- **Authentication:** ✅ Configured and functional
- **Admin Dashboard:** ✅ Fully functional
- **RLS Policies:** ✅ Implemented and active
- **Storage:** ⚠️ Not configured (optional)

### **Backup Strategy**
- **Automated Backups:** Supabase managed
- **Point-in-time Recovery:** Available
- **Export Options:** SQL dump, CSV export

---

**Last Updated:** July 16, 2025  
**Database Version:** PostgreSQL 15.x (Supabase managed)  
**Documentation Status:** Complete - Production Ready
**Admin Dashboard:** ✅ Fully Functional

---

*This documentation should be updated as the database schema evolves and new features are implemented.*