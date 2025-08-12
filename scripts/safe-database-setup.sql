-- Safe Database Setup for ONA Portfolio
-- This script safely creates all necessary tables and policies, handling existing ones gracefully

-- ====================
-- PART 1: DROP EXISTING POLICIES (SAFELY)
-- ====================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "categories_public_read" ON categories;
DROP POLICY IF EXISTS "categories_admin_write" ON categories;
DROP POLICY IF EXISTS "projects_public_read" ON projects;
DROP POLICY IF EXISTS "projects_admin_access" ON projects;
DROP POLICY IF EXISTS "team_members_public_read" ON team_members;
DROP POLICY IF EXISTS "team_members_admin_access" ON team_members;
DROP POLICY IF EXISTS "services_public_read" ON services;
DROP POLICY IF EXISTS "services_admin_access" ON services;
DROP POLICY IF EXISTS "explore_content_public_read" ON explore_content;
DROP POLICY IF EXISTS "explore_content_admin_access" ON explore_content;
DROP POLICY IF EXISTS "partners_public_read" ON partners;
DROP POLICY IF EXISTS "partners_admin_access" ON partners;
DROP POLICY IF EXISTS "project_partners_public_read" ON project_partners;
DROP POLICY IF EXISTS "project_partners_admin_access" ON project_partners;
DROP POLICY IF EXISTS "project_team_members_public_read" ON project_team_members;
DROP POLICY IF EXISTS "project_team_members_admin_access" ON project_team_members;
DROP POLICY IF EXISTS "contact_submissions_public_insert" ON contact_submissions;
DROP POLICY IF EXISTS "contact_submissions_admin_access" ON contact_submissions;
DROP POLICY IF EXISTS "site_settings_public_read" ON site_settings;
DROP POLICY IF EXISTS "site_settings_admin_access" ON site_settings;
DROP POLICY IF EXISTS "newsletter_subscribers_public_insert" ON newsletter_subscribers;
DROP POLICY IF EXISTS "newsletter_subscribers_admin_access" ON newsletter_subscribers;
DROP POLICY IF EXISTS "admin_profiles_self_access" ON admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_service_role" ON admin_profiles;
DROP POLICY IF EXISTS "admin_activity_logs_admin_only" ON admin_activity_logs;

-- ====================
-- PART 2: CREATE OR MODIFY TABLES
-- ====================

-- Create admin_profiles table (add missing columns if table exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'admin_profiles') THEN
        CREATE TABLE admin_profiles (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
            full_name TEXT,
            avatar_url TEXT,
            role TEXT DEFAULT 'admin',
            permissions JSONB DEFAULT '{}',
            is_active BOOLEAN DEFAULT TRUE,
            last_login TIMESTAMP WITH TIME ZONE,
            login_count INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        -- Add missing columns if they don't exist
        ALTER TABLE admin_profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
        ALTER TABLE admin_profiles ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create admin_activity_logs table
CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table with all fields including consultant fields
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    content TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    featured_image_url TEXT,
    gallery_images JSONB DEFAULT '[]',
    features TEXT[] DEFAULT '{}',
    client_name TEXT,
    location TEXT,
    project_type TEXT,
    project_status TEXT DEFAULT 'planning',
    completion_date DATE,
    architecture_consultant TEXT,
    engineering_consultant TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT,
    og_image_url TEXT,
    video_url TEXT,
    area TEXT,
    year INTEGER,
    tags TEXT[] DEFAULT '{}',
    search_vector TSVECTOR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Add consultant fields if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'architecture_consultant') THEN
        ALTER TABLE projects ADD COLUMN architecture_consultant TEXT;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'engineering_consultant') THEN
        ALTER TABLE projects ADD COLUMN engineering_consultant TEXT;
    END IF;
END $$;

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT,
    bio TEXT,
    avatar_url TEXT,
    email TEXT,
    phone TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    content TEXT,
    icon_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create explore_content table
CREATE TABLE IF NOT EXISTS explore_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    featured_image_url TEXT,
    author_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    description TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create relationship tables
CREATE TABLE IF NOT EXISTS project_partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
    role TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, partner_id)
);

CREATE TABLE IF NOT EXISTS project_team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    team_member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
    role TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, team_member_id)
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- ====================
-- PART 3: CREATE INDEXES (SAFELY)
-- ====================

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(project_status);
CREATE INDEX IF NOT EXISTS idx_team_members_published ON team_members(is_published);
CREATE INDEX IF NOT EXISTS idx_team_members_sort ON team_members(sort_order);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_published ON services(is_published);
CREATE INDEX IF NOT EXISTS idx_explore_content_slug ON explore_content(slug);
CREATE INDEX IF NOT EXISTS idx_explore_content_published ON explore_content(is_published);
CREATE INDEX IF NOT EXISTS idx_partners_published ON partners(is_published);

-- ====================
-- PART 4: ENABLE RLS
-- ====================

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE explore_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- ====================
-- PART 5: CREATE RLS POLICIES
-- ====================

-- Admin profiles policies
CREATE POLICY "admin_profiles_self_access" ON admin_profiles
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admin_profiles_service_role" ON admin_profiles
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Admin activity logs policies
CREATE POLICY "admin_activity_logs_admin_only" ON admin_activity_logs
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Categories policies
CREATE POLICY "categories_public_read" ON categories
    FOR SELECT USING (true);

CREATE POLICY "categories_admin_write" ON categories
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Projects policies
CREATE POLICY "projects_public_read" ON projects
    FOR SELECT USING (is_published = true);

CREATE POLICY "projects_admin_access" ON projects
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Team members policies
CREATE POLICY "team_members_public_read" ON team_members
    FOR SELECT USING (is_published = true);

CREATE POLICY "team_members_admin_access" ON team_members
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Services policies
CREATE POLICY "services_public_read" ON services
    FOR SELECT USING (is_published = true);

CREATE POLICY "services_admin_access" ON services
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Explore content policies
CREATE POLICY "explore_content_public_read" ON explore_content
    FOR SELECT USING (is_published = true);

CREATE POLICY "explore_content_admin_access" ON explore_content
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Partners policies
CREATE POLICY "partners_public_read" ON partners
    FOR SELECT USING (is_published = true);

CREATE POLICY "partners_admin_access" ON partners
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Project relationships policies
CREATE POLICY "project_partners_public_read" ON project_partners
    FOR SELECT USING (true);

CREATE POLICY "project_partners_admin_access" ON project_partners
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "project_team_members_public_read" ON project_team_members
    FOR SELECT USING (true);

CREATE POLICY "project_team_members_admin_access" ON project_team_members
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Contact submissions policies
CREATE POLICY "contact_submissions_public_insert" ON contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "contact_submissions_admin_access" ON contact_submissions
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Site settings policies
CREATE POLICY "site_settings_public_read" ON site_settings
    FOR SELECT USING (true);

CREATE POLICY "site_settings_admin_access" ON site_settings
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Newsletter subscribers policies
CREATE POLICY "newsletter_subscribers_public_insert" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "newsletter_subscribers_admin_access" ON newsletter_subscribers
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- ====================
-- PART 6: INSERT SAMPLE DATA (SAFELY)
-- ====================

-- Insert default categories
INSERT INTO categories (name, description, color) VALUES
    ('Residential', 'Residential architecture projects', '#3B82F6'),
    ('Commercial', 'Commercial and office buildings', '#10B981'),
    ('Industrial', 'Industrial and manufacturing facilities', '#F59E0B'),
    ('Healthcare', 'Healthcare and medical facilities', '#EF4444'),
    ('Education', 'Educational institutions', '#8B5CF6')
ON CONFLICT (name) DO NOTHING;

-- Insert default site settings
INSERT INTO site_settings (key, value, description) VALUES
    ('site_name', 'ONA Portfolio', 'Website name'),
    ('site_description', 'Architectural Design Portfolio', 'Website description'),
    ('contact_email', 'info@ona.com', 'Contact email address'),
    ('contact_phone', '+1 (555) 123-4567', 'Contact phone number')
ON CONFLICT (key) DO NOTHING;

-- ====================
-- PART 7: CREATE TRIGGERS (SAFELY)
-- ====================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables (drop existing first)
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
DROP TRIGGER IF EXISTS update_explore_content_updated_at ON explore_content;
DROP TRIGGER IF EXISTS update_partners_updated_at ON partners;
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;

-- Create triggers
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_explore_content_updated_at BEFORE UPDATE ON explore_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================
-- PART 8: VERIFICATION
-- ====================

-- Verify tables were created
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'admin_profiles',
    'admin_activity_logs',
    'categories',
    'projects',
    'team_members',
    'services',
    'explore_content',
    'partners',
    'project_partners',
    'project_team_members',
    'contact_submissions',
    'site_settings',
    'newsletter_subscribers'
)
ORDER BY tablename;

-- Verify consultant fields exist in projects table
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name IN ('architecture_consultant', 'engineering_consultant')
ORDER BY column_name;

-- Verify policies were created
SELECT 
    schemaname,
    tablename,
    policyname
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN (
    'admin_profiles',
    'admin_activity_logs',
    'categories',
    'projects',
    'team_members',
    'services',
    'explore_content',
    'partners',
    'project_partners',
    'project_team_members',
    'contact_submissions',
    'site_settings',
    'newsletter_subscribers'
)
ORDER BY tablename, policyname;
