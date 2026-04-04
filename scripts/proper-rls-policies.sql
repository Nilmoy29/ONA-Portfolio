-- PROPER RLS POLICIES FOR ONA PORTFOLIO
-- This implements secure RLS without recursion by using direct role checks

-- ====================
-- STEP 1: ENSURE RLS IS ENABLED
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
-- STEP 2: DROP EXISTING POLICIES
-- ====================

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "projects_published_access" ON projects;
DROP POLICY IF EXISTS "projects_service_role_access" ON projects;
DROP POLICY IF EXISTS "services_published_access" ON services;
DROP POLICY IF EXISTS "services_service_role_access" ON services;
DROP POLICY IF EXISTS "team_published_access" ON team_members;
DROP POLICY IF EXISTS "team_service_role_access" ON team_members;
DROP POLICY IF EXISTS "partners_published_access" ON partners;
DROP POLICY IF EXISTS "partners_service_role_access" ON partners;
DROP POLICY IF EXISTS "explore_published_access" ON explore_content;
DROP POLICY IF EXISTS "explore_service_role_access" ON explore_content;
DROP POLICY IF EXISTS "categories_open_access" ON categories;
DROP POLICY IF EXISTS "categories_service_role_access" ON categories;
DROP POLICY IF EXISTS "project_partners_open_access" ON project_partners;
DROP POLICY IF EXISTS "project_partners_service_role_access" ON project_partners;
DROP POLICY IF EXISTS "project_team_open_access" ON project_team_members;
DROP POLICY IF EXISTS "project_team_service_role_access" ON project_team_members;
DROP POLICY IF EXISTS "site_settings_public_access" ON site_settings;
DROP POLICY IF EXISTS "site_settings_service_role_access" ON site_settings;
DROP POLICY IF EXISTS "contact_insert_access" ON contact_submissions;
DROP POLICY IF EXISTS "contact_service_role_access" ON contact_submissions;
DROP POLICY IF EXISTS "admin_self_access" ON admin_profiles;
DROP POLICY IF EXISTS "logs_service_role_access" ON admin_activity_logs;

-- ====================
-- STEP 3: PUBLIC CONTENT POLICIES
-- ====================

-- Projects: Public read for published, admin full access
CREATE POLICY "projects_public_read" ON projects
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "projects_admin_full" ON projects
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Services: Public read for published, admin full access
CREATE POLICY "services_public_read" ON services
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "services_admin_full" ON services
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Team Members: Public read for published, admin full access
CREATE POLICY "team_members_public_read" ON team_members
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "team_members_admin_full" ON team_members
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Partners: Public read for published, admin full access
CREATE POLICY "partners_public_read" ON partners
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "partners_admin_full" ON partners
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Explore Content: Public read for published, admin full access
CREATE POLICY "explore_content_public_read" ON explore_content
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "explore_content_admin_full" ON explore_content
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Categories: Public read for all (no is_published field)
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "categories_admin_full" ON categories
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ====================
-- STEP 4: JUNCTION TABLE POLICIES
-- ====================

-- Project Partners: Public read, admin full access
CREATE POLICY "project_partners_public_read" ON project_partners
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "project_partners_admin_full" ON project_partners
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Project Team Members: Public read, admin full access
CREATE POLICY "project_team_members_public_read" ON project_team_members
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "project_team_members_admin_full" ON project_team_members
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ====================
-- STEP 5: SITE SETTINGS POLICIES
-- ====================

-- Site Settings: Public read for public settings only
CREATE POLICY "site_settings_public_read" ON site_settings
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

CREATE POLICY "site_settings_admin_full" ON site_settings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ====================
-- STEP 6: CONTACT SUBMISSIONS POLICIES
-- ====================

-- Contact Submissions: Public insert, admin full access
CREATE POLICY "contact_submissions_public_insert" ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "contact_submissions_admin_full" ON contact_submissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ====================
-- STEP 7: ADMIN PROFILES POLICIES (NO RECURSION)
-- ====================

-- Admin Profiles: Self-access and service role only
-- NO FUNCTION CALLS - Direct comparisons only
CREATE POLICY "admin_profiles_self_read" ON admin_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admin_profiles_self_update" ON admin_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admin_profiles_service_role" ON admin_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ====================
-- STEP 8: ADMIN ACTIVITY LOGS POLICIES
-- ====================

-- Admin Activity Logs: Service role only
CREATE POLICY "admin_activity_logs_service_role" ON admin_activity_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ====================
-- STEP 9: GRANT PERMISSIONS
-- ====================

-- Grant necessary permissions to roles
GRANT SELECT ON projects, services, team_members, partners, explore_content, categories, project_partners, project_team_members, site_settings TO anon;
GRANT INSERT ON contact_submissions TO anon;

GRANT SELECT ON projects, services, team_members, partners, explore_content, categories, project_partners, project_team_members, site_settings, contact_submissions TO authenticated;
GRANT INSERT ON contact_submissions TO authenticated;
GRANT SELECT ON admin_profiles TO authenticated;
GRANT UPDATE ON admin_profiles TO authenticated;

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- ====================
-- STEP 10: CREATE SIMPLE ADMIN CHECK FUNCTION (OPTIONAL)
-- ====================

-- Create a simple admin check function that doesn't cause recursion
-- This function uses service_role bypass to avoid RLS
CREATE OR REPLACE FUNCTION is_admin_user(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE admin_profiles.user_id = is_admin_user.user_id
    AND is_active = true
  );
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION is_admin_user TO authenticated, service_role;

-- Success message
SELECT 'Proper RLS policies implemented successfully!' as status;