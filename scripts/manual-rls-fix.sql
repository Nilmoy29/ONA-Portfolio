-- MANUAL RLS FIX FOR ONA PORTFOLIO
-- Run this in Supabase SQL Editor to fix the infinite recursion issue

-- ====================
-- STEP 1: DROP ALL PROBLEMATIC POLICIES
-- ====================

-- Drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "projects_public_read" ON projects;
DROP POLICY IF EXISTS "projects_admin_access" ON projects;
DROP POLICY IF EXISTS "services_public_read" ON services;
DROP POLICY IF EXISTS "services_admin_access" ON services;
DROP POLICY IF EXISTS "team_members_public_read" ON team_members;
DROP POLICY IF EXISTS "team_members_admin_access" ON team_members;
DROP POLICY IF EXISTS "partners_public_read" ON partners;
DROP POLICY IF EXISTS "partners_admin_access" ON partners;
DROP POLICY IF EXISTS "explore_content_public_read" ON explore_content;
DROP POLICY IF EXISTS "explore_content_admin_access" ON explore_content;
DROP POLICY IF EXISTS "categories_public_read" ON categories;
DROP POLICY IF EXISTS "categories_admin_write" ON categories;
DROP POLICY IF EXISTS "project_partners_public_read" ON project_partners;
DROP POLICY IF EXISTS "project_partners_admin_access" ON project_partners;
DROP POLICY IF EXISTS "project_team_members_public_read" ON project_team_members;
DROP POLICY IF EXISTS "project_team_members_admin_access" ON project_team_members;
DROP POLICY IF EXISTS "site_settings_public_read" ON site_settings;
DROP POLICY IF EXISTS "site_settings_admin_access" ON site_settings;
DROP POLICY IF EXISTS "contact_submissions_public_insert" ON contact_submissions;
DROP POLICY IF EXISTS "contact_submissions_admin_access" ON contact_submissions;
DROP POLICY IF EXISTS "admin_profiles_self_access" ON admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_service_role" ON admin_profiles;
DROP POLICY IF EXISTS "admin_activity_logs_admin_only" ON admin_activity_logs;

-- ====================
-- STEP 2: TEMPORARILY DISABLE RLS
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
-- STEP 4: CREATE SIMPLE PUBLIC ACCESS POLICIES
-- ====================

-- Projects - public read for published content
CREATE POLICY "public_read_published" ON projects 
  FOR SELECT 
  USING (is_published = true);

-- Services - public read for published content
CREATE POLICY "public_read_published" ON services 
  FOR SELECT 
  USING (is_published = true);

-- Team members - public read for published content
CREATE POLICY "public_read_published" ON team_members 
  FOR SELECT 
  USING (is_published = true);

-- Partners - public read for published content
CREATE POLICY "public_read_published" ON partners 
  FOR SELECT 
  USING (is_published = true);

-- Explore content - public read for published content
CREATE POLICY "public_read_published" ON explore_content 
  FOR SELECT 
  USING (is_published = true);

-- Categories - public read for all (no is_published column)
CREATE POLICY "public_read_all" ON categories 
  FOR SELECT 
  USING (true);

-- Project partners - public read for all
CREATE POLICY "public_read_all" ON project_partners 
  FOR SELECT 
  USING (true);

-- Project team members - public read for all
CREATE POLICY "public_read_all" ON project_team_members 
  FOR SELECT 
  USING (true);

-- Site settings - public read for public settings only
CREATE POLICY "public_read_public" ON site_settings 
  FOR SELECT 
  USING (is_public = true);

-- Contact submissions - public insert only
CREATE POLICY "public_insert_contact" ON contact_submissions 
  FOR INSERT 
  WITH CHECK (true);

-- ====================
-- STEP 5: CREATE ADMIN POLICIES (SERVICE ROLE BYPASS)
-- ====================

-- Admin full access using service role (bypasses RLS completely)
CREATE POLICY "admin_full_access" ON projects 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "admin_full_access" ON services 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "admin_full_access" ON team_members 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "admin_full_access" ON partners 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "admin_full_access" ON explore_content 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "admin_full_access" ON categories 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "admin_full_access" ON project_partners 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "admin_full_access" ON project_team_members 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "admin_full_access" ON site_settings 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "admin_full_access" ON contact_submissions 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ====================
-- STEP 6: ADMIN PROFILES POLICIES (NO RECURSION)
-- ====================

-- Admin profiles - self access (no function calls)
CREATE POLICY "admin_profiles_self_access" ON admin_profiles
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admin profiles - service role bypass
CREATE POLICY "admin_profiles_service_role" ON admin_profiles
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ====================
-- STEP 7: ADMIN ACTIVITY LOGS
-- ====================

-- Admin activity logs - service role only
CREATE POLICY "admin_activity_logs_service_role" ON admin_activity_logs
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ====================
-- STEP 8: GRANT PERMISSIONS
-- ====================

-- Grant necessary permissions to anon and authenticated roles
GRANT SELECT ON projects, services, team_members, partners, explore_content, categories, project_partners, project_team_members, site_settings TO anon;
GRANT INSERT ON contact_submissions TO anon;
GRANT SELECT ON projects, services, team_members, partners, explore_content, categories, project_partners, project_team_members, site_settings, contact_submissions TO authenticated;

-- Success message
SELECT 'RLS policies fixed successfully! Public access enabled.' as status;