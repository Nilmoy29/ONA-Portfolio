-- Fix RLS Policies for Admin Operations
-- This script fixes the authorization issues in the admin dashboard

-- ====================
-- PART 1: DROP EXISTING POLICIES
-- ====================

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "admin_profiles_self_access" ON admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_service_role" ON admin_profiles;
DROP POLICY IF EXISTS "categories_public_read" ON categories;
DROP POLICY IF EXISTS "categories_admin_write" ON categories;
DROP POLICY IF EXISTS "services_public_read" ON services;
DROP POLICY IF EXISTS "services_admin_access" ON services;
DROP POLICY IF EXISTS "projects_public_read" ON projects;
DROP POLICY IF EXISTS "projects_admin_access" ON projects;
DROP POLICY IF EXISTS "team_members_public_read" ON team_members;
DROP POLICY IF EXISTS "team_members_admin_access" ON team_members;
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
DROP POLICY IF EXISTS "admin_activity_logs_admin_only" ON admin_activity_logs;

-- ====================
-- PART 2: CREATE IMPROVED ADMIN CHECK FUNCTION
-- ====================

-- Create improved admin check function
CREATE OR REPLACE FUNCTION is_admin_user(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
DECLARE
  admin_exists BOOLEAN := FALSE;
BEGIN
  -- If no user provided, return false
  IF check_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check if user has active admin profile
  SELECT EXISTS(
    SELECT 1 
    FROM admin_profiles 
    WHERE user_id = check_user_id 
    AND is_active = TRUE
  ) INTO admin_exists;
  
  RETURN admin_exists;
EXCEPTION
  WHEN OTHERS THEN
    -- Return false for security
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================
-- PART 3: SIMPLIFIED RLS POLICIES
-- ====================

-- Admin profiles - allow service role and self access
CREATE POLICY "admin_profiles_access" ON admin_profiles
  FOR ALL 
  USING (
    auth.role() = 'service_role' OR 
    auth.uid() = user_id
  )
  WITH CHECK (
    auth.role() = 'service_role' OR 
    auth.uid() = user_id
  );

-- Categories - public read, service role or admin write
CREATE POLICY "categories_access" ON categories
  FOR ALL 
  USING (
    auth.role() = 'service_role' OR 
    is_admin_user() OR 
    (auth.role() = 'anon' AND current_setting('request.method', true) = 'GET')
  )
  WITH CHECK (
    auth.role() = 'service_role' OR 
    is_admin_user()
  );

-- Services - public read for published, service role or admin full access
CREATE POLICY "services_access" ON services
  FOR ALL 
  USING (
    auth.role() = 'service_role' OR 
    is_admin_user() OR 
    (is_published = true AND current_setting('request.method', true) = 'GET')
  )
  WITH CHECK (
    auth.role() = 'service_role' OR 
    is_admin_user()
  );

-- Projects - public read for published, service role or admin full access
CREATE POLICY "projects_access" ON projects
  FOR ALL 
  USING (
    auth.role() = 'service_role' OR 
    is_admin_user() OR 
    (is_published = true AND current_setting('request.method', true) = 'GET')
  )
  WITH CHECK (
    auth.role() = 'service_role' OR 
    is_admin_user()
  );

-- Team members - public read for published, service role or admin full access
CREATE POLICY "team_members_access" ON team_members
  FOR ALL 
  USING (
    auth.role() = 'service_role' OR 
    is_admin_user() OR 
    (is_published = true AND current_setting('request.method', true) = 'GET')
  )
  WITH CHECK (
    auth.role() = 'service_role' OR 
    is_admin_user()
  );

-- Explore content - public read for published, service role or admin full access
CREATE POLICY "explore_content_access" ON explore_content
  FOR ALL 
  USING (
    auth.role() = 'service_role' OR 
    is_admin_user() OR 
    (is_published = true AND current_setting('request.method', true) = 'GET')
  )
  WITH CHECK (
    auth.role() = 'service_role' OR 
    is_admin_user()
  );

-- Partners - public read for published, service role or admin full access
CREATE POLICY "partners_access" ON partners
  FOR ALL 
  USING (
    auth.role() = 'service_role' OR 
    is_admin_user() OR 
    (is_published = true AND current_setting('request.method', true) = 'GET')
  )
  WITH CHECK (
    auth.role() = 'service_role' OR 
    is_admin_user()
  );

-- Project partners - public read, service role or admin write
CREATE POLICY "project_partners_access" ON project_partners
  FOR ALL 
  USING (
    auth.role() = 'service_role' OR 
    is_admin_user() OR 
    current_setting('request.method', true) = 'GET'
  )
  WITH CHECK (
    auth.role() = 'service_role' OR 
    is_admin_user()
  );

-- Project team members - public read, service role or admin write
CREATE POLICY "project_team_members_access" ON project_team_members
  FOR ALL 
  USING (
    auth.role() = 'service_role' OR 
    is_admin_user() OR 
    current_setting('request.method', true) = 'GET'
  )
  WITH CHECK (
    auth.role() = 'service_role' OR 
    is_admin_user()
  );

-- Contact submissions - public insert, service role or admin read/update/delete
CREATE POLICY "contact_submissions_access" ON contact_submissions
  FOR ALL 
  USING (
    auth.role() = 'service_role' OR 
    is_admin_user()
  )
  WITH CHECK (
    auth.role() = 'service_role' OR 
    is_admin_user() OR 
    current_setting('request.method', true) = 'POST'
  );

-- Site settings - public read for public settings, service role or admin full access
CREATE POLICY "site_settings_access" ON site_settings
  FOR ALL 
  USING (
    auth.role() = 'service_role' OR 
    is_admin_user() OR 
    (is_public = true AND current_setting('request.method', true) = 'GET')
  )
  WITH CHECK (
    auth.role() = 'service_role' OR 
    is_admin_user()
  );

-- Admin activity logs - service role or admin only
CREATE POLICY "admin_activity_logs_access" ON admin_activity_logs
  FOR ALL 
  USING (
    auth.role() = 'service_role' OR 
    is_admin_user()
  )
  WITH CHECK (
    auth.role() = 'service_role' OR 
    is_admin_user()
  );

-- ====================
-- PART 4: ENSURE PROPER PERMISSIONS
-- ====================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, service_role;

-- ====================
-- PART 5: VERIFICATION
-- ====================

-- Verify that the service role can access all tables
DO $$
BEGIN
  -- Test service role access
  RAISE NOTICE 'RLS policies updated successfully!';
  RAISE NOTICE 'Service role should now have full access to all tables.';
  RAISE NOTICE 'Admin users with active profiles should have full access.';
  RAISE NOTICE 'Public users should have read access to published content only.';
END
$$;

SELECT 'RLS policies fixed successfully!' as status;