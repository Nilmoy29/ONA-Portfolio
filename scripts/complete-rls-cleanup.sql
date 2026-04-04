-- COMPLETE RLS CLEANUP AND FIX FOR ONA PORTFOLIO
-- This script handles existing policies and ensures a clean setup

-- ====================
-- STEP 1: DROP ALL POSSIBLE POLICY VARIATIONS
-- ====================

-- Drop all existing policies with all possible names
DROP POLICY IF EXISTS "projects_public_read" ON projects;
DROP POLICY IF EXISTS "projects_admin_access" ON projects;
DROP POLICY IF EXISTS "public_read_published" ON projects;
DROP POLICY IF EXISTS "admin_full_access" ON projects;

DROP POLICY IF EXISTS "services_public_read" ON services;
DROP POLICY IF EXISTS "services_admin_access" ON services;
DROP POLICY IF EXISTS "public_read_published" ON services;
DROP POLICY IF EXISTS "admin_full_access" ON services;

DROP POLICY IF EXISTS "team_members_public_read" ON team_members;
DROP POLICY IF EXISTS "team_members_admin_access" ON team_members;
DROP POLICY IF EXISTS "public_read_published" ON team_members;
DROP POLICY IF EXISTS "admin_full_access" ON team_members;

DROP POLICY IF EXISTS "partners_public_read" ON partners;
DROP POLICY IF EXISTS "partners_admin_access" ON partners;
DROP POLICY IF EXISTS "public_read_published" ON partners;
DROP POLICY IF EXISTS "admin_full_access" ON partners;

DROP POLICY IF EXISTS "explore_content_public_read" ON explore_content;
DROP POLICY IF EXISTS "explore_content_admin_access" ON explore_content;
DROP POLICY IF EXISTS "public_read_published" ON explore_content;
DROP POLICY IF EXISTS "admin_full_access" ON explore_content;

DROP POLICY IF EXISTS "categories_public_read" ON categories;
DROP POLICY IF EXISTS "categories_admin_write" ON categories;
DROP POLICY IF EXISTS "public_read_all" ON categories;
DROP POLICY IF EXISTS "admin_full_access" ON categories;

DROP POLICY IF EXISTS "project_partners_public_read" ON project_partners;
DROP POLICY IF EXISTS "project_partners_admin_access" ON project_partners;
DROP POLICY IF EXISTS "public_read_all" ON project_partners;
DROP POLICY IF EXISTS "admin_full_access" ON project_partners;

DROP POLICY IF EXISTS "project_team_members_public_read" ON project_team_members;
DROP POLICY IF EXISTS "project_team_members_admin_access" ON project_team_members;
DROP POLICY IF EXISTS "public_read_all" ON project_team_members;
DROP POLICY IF EXISTS "admin_full_access" ON project_team_members;

DROP POLICY IF EXISTS "site_settings_public_read" ON site_settings;
DROP POLICY IF EXISTS "site_settings_admin_access" ON site_settings;
DROP POLICY IF EXISTS "public_read_public" ON site_settings;
DROP POLICY IF EXISTS "admin_full_access" ON site_settings;

DROP POLICY IF EXISTS "contact_submissions_public_insert" ON contact_submissions;
DROP POLICY IF EXISTS "contact_submissions_admin_access" ON contact_submissions;
DROP POLICY IF EXISTS "public_insert_contact" ON contact_submissions;
DROP POLICY IF EXISTS "admin_full_access" ON contact_submissions;

DROP POLICY IF EXISTS "admin_profiles_self_access" ON admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_service_role" ON admin_profiles;

DROP POLICY IF EXISTS "admin_activity_logs_admin_only" ON admin_activity_logs;
DROP POLICY IF EXISTS "admin_activity_logs_service_role" ON admin_activity_logs;

-- ====================
-- STEP 2: DISABLE RLS COMPLETELY
-- ====================

ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE partners DISABLE ROW LEVEL SECURITY;
ALTER TABLE explore_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_partners DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs DISABLE ROW LEVEL SECURITY;

-- ====================
-- STEP 3: RE-ENABLE RLS
-- ====================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE explore_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- ====================
-- STEP 4: CREATE FRESH POLICIES
-- ====================

-- Projects policies
CREATE POLICY "projects_public_published" ON projects 
  FOR SELECT 
  USING (is_published = true);

CREATE POLICY "projects_admin_all" ON projects 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Services policies
CREATE POLICY "services_public_published" ON services 
  FOR SELECT 
  USING (is_published = true);

CREATE POLICY "services_admin_all" ON services 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Team members policies
CREATE POLICY "team_public_published" ON team_members 
  FOR SELECT 
  USING (is_published = true);

CREATE POLICY "team_admin_all" ON team_members 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Partners policies
CREATE POLICY "partners_public_published" ON partners 
  FOR SELECT 
  USING (is_published = true);

CREATE POLICY "partners_admin_all" ON partners 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Explore content policies
CREATE POLICY "explore_public_published" ON explore_content 
  FOR SELECT 
  USING (is_published = true);

CREATE POLICY "explore_admin_all" ON explore_content 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Categories policies (no is_published column)
CREATE POLICY "categories_public_all" ON categories 
  FOR SELECT 
  USING (true);

CREATE POLICY "categories_admin_all" ON categories 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Project partners policies
CREATE POLICY "project_partners_public_all" ON project_partners 
  FOR SELECT 
  USING (true);

CREATE POLICY "project_partners_admin_all" ON project_partners 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Project team members policies
CREATE POLICY "project_team_public_all" ON project_team_members 
  FOR SELECT 
  USING (true);

CREATE POLICY "project_team_admin_all" ON project_team_members 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Site settings policies
CREATE POLICY "settings_public_only" ON site_settings 
  FOR SELECT 
  USING (is_public = true);

CREATE POLICY "settings_admin_all" ON site_settings 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Contact submissions policies
CREATE POLICY "contact_public_insert" ON contact_submissions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "contact_admin_all" ON contact_submissions 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Admin profiles policies (simple, no recursion)
CREATE POLICY "admin_profiles_own" ON admin_profiles
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admin_profiles_service" ON admin_profiles
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Admin activity logs policies
CREATE POLICY "logs_admin_only" ON admin_activity_logs
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ====================
-- STEP 5: GRANT PERMISSIONS
-- ====================

-- Grant permissions to anon role for public access
GRANT SELECT ON projects TO anon;
GRANT SELECT ON services TO anon;
GRANT SELECT ON team_members TO anon;
GRANT SELECT ON partners TO anon;
GRANT SELECT ON explore_content TO anon;
GRANT SELECT ON categories TO anon;
GRANT SELECT ON project_partners TO anon;
GRANT SELECT ON project_team_members TO anon;
GRANT SELECT ON site_settings TO anon;
GRANT INSERT ON contact_submissions TO anon;

-- Grant permissions to authenticated role
GRANT SELECT ON projects, services, team_members, partners, explore_content, categories, project_partners, project_team_members, site_settings, contact_submissions TO authenticated;

-- Success message
SELECT 'RLS cleanup and fix completed successfully!' as status;