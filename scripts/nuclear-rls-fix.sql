-- NUCLEAR RLS FIX - REMOVES ALL PROBLEMATIC FUNCTIONS AND POLICIES
-- This will completely reset the RLS system to a working state

-- ====================
-- STEP 1: DROP ALL FUNCTIONS THAT MIGHT CAUSE RECURSION
-- ====================

-- Drop all functions that might be causing recursion
DROP FUNCTION IF EXISTS log_admin_activity() CASCADE;
DROP FUNCTION IF EXISTS is_admin(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_admin_profile(UUID) CASCADE;
DROP FUNCTION IF EXISTS is_admin_secure(UUID) CASCADE;
DROP FUNCTION IF EXISTS check_admin_status(UUID) CASCADE;
DROP FUNCTION IF EXISTS is_admin_secure() CASCADE;

-- ====================
-- STEP 2: DROP ALL TRIGGERS
-- ====================

-- Drop all triggers that might be calling these functions
DROP TRIGGER IF EXISTS projects_activity_trigger ON projects;
DROP TRIGGER IF EXISTS team_members_activity_trigger ON team_members;
DROP TRIGGER IF EXISTS services_activity_trigger ON services;
DROP TRIGGER IF EXISTS explore_content_activity_trigger ON explore_content;
DROP TRIGGER IF EXISTS partners_activity_trigger ON partners;
DROP TRIGGER IF EXISTS categories_activity_trigger ON categories;
DROP TRIGGER IF EXISTS site_settings_activity_trigger ON site_settings;

-- ====================
-- STEP 3: DISABLE RLS ON ALL TABLES
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
-- STEP 4: RE-ENABLE RLS
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
-- STEP 5: CREATE ULTRA-SIMPLE POLICIES
-- ====================

-- Projects - simple published check
CREATE POLICY "projects_published_access" ON projects 
  FOR SELECT 
  USING (is_published = true);

CREATE POLICY "projects_service_role_access" ON projects 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Services - simple published check  
CREATE POLICY "services_published_access" ON services 
  FOR SELECT 
  USING (is_published = true);

CREATE POLICY "services_service_role_access" ON services 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Team members - simple published check
CREATE POLICY "team_published_access" ON team_members 
  FOR SELECT 
  USING (is_published = true);

CREATE POLICY "team_service_role_access" ON team_members 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Partners - simple published check
CREATE POLICY "partners_published_access" ON partners 
  FOR SELECT 
  USING (is_published = true);

CREATE POLICY "partners_service_role_access" ON partners 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Explore content - simple published check
CREATE POLICY "explore_published_access" ON explore_content 
  FOR SELECT 
  USING (is_published = true);

CREATE POLICY "explore_service_role_access" ON explore_content 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Categories - open access
CREATE POLICY "categories_open_access" ON categories 
  FOR SELECT 
  USING (true);

CREATE POLICY "categories_service_role_access" ON categories 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Project partners - open access
CREATE POLICY "project_partners_open_access" ON project_partners 
  FOR SELECT 
  USING (true);

CREATE POLICY "project_partners_service_role_access" ON project_partners 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Project team members - open access
CREATE POLICY "project_team_open_access" ON project_team_members 
  FOR SELECT 
  USING (true);

CREATE POLICY "project_team_service_role_access" ON project_team_members 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Site settings - public only
CREATE POLICY "site_settings_public_access" ON site_settings 
  FOR SELECT 
  USING (is_public = true);

CREATE POLICY "site_settings_service_role_access" ON site_settings 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Contact submissions - insert only for public
CREATE POLICY "contact_insert_access" ON contact_submissions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "contact_service_role_access" ON contact_submissions 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Admin profiles - self and service role only
CREATE POLICY "admin_self_access" ON admin_profiles
  FOR ALL 
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- Admin activity logs - service role only
CREATE POLICY "logs_service_role_access" ON admin_activity_logs
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ====================
-- STEP 6: GRANT PERMISSIONS TO ANON
-- ====================

-- Grant select permissions to anonymous users
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

-- Grant select permissions to authenticated users
GRANT SELECT ON projects TO authenticated;
GRANT SELECT ON services TO authenticated;
GRANT SELECT ON team_members TO authenticated;
GRANT SELECT ON partners TO authenticated;
GRANT SELECT ON explore_content TO authenticated;
GRANT SELECT ON categories TO authenticated;
GRANT SELECT ON project_partners TO authenticated;
GRANT SELECT ON project_team_members TO authenticated;
GRANT SELECT ON site_settings TO authenticated;
GRANT INSERT ON contact_submissions TO authenticated;

-- Success message
SELECT 'Nuclear RLS fix completed - all recursive functions removed!' as status;