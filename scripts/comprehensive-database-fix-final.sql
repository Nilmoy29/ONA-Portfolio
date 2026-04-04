-- Comprehensive Database Schema & RLS Fix for ONA Portfolio (FINAL CORRECTED)
-- This script creates a proper database schema with working RLS policies and admin auth

-- ====================
-- PART 1: CLEANUP (CORRECT DEPENDENCY ORDER)
-- ====================

-- First, drop all triggers that depend on functions
DROP TRIGGER IF EXISTS projects_activity_trigger ON projects;
DROP TRIGGER IF EXISTS team_members_activity_trigger ON team_members;
DROP TRIGGER IF EXISTS services_activity_trigger ON services;
DROP TRIGGER IF EXISTS explore_content_activity_trigger ON explore_content;
DROP TRIGGER IF EXISTS partners_activity_trigger ON partners;
DROP TRIGGER IF EXISTS categories_activity_trigger ON categories;
DROP TRIGGER IF EXISTS site_settings_activity_trigger ON site_settings;

-- Second, drop ALL policies that depend on functions (before dropping functions)
DROP POLICY IF EXISTS "Published projects are viewable by everyone" ON projects;
DROP POLICY IF EXISTS "All projects are viewable by admins" ON projects;
DROP POLICY IF EXISTS "Projects are editable by admins" ON projects;
DROP POLICY IF EXISTS "Published team members are viewable by everyone" ON team_members;
DROP POLICY IF EXISTS "All team members are viewable by admins" ON team_members;
DROP POLICY IF EXISTS "Team members are editable by admins" ON team_members;
DROP POLICY IF EXISTS "Published services are viewable by everyone" ON services;
DROP POLICY IF EXISTS "All services are viewable by admins" ON services;
DROP POLICY IF EXISTS "Services are editable by admins" ON services;
DROP POLICY IF EXISTS "Published explore content is viewable by everyone" ON explore_content;
DROP POLICY IF EXISTS "All explore content are viewable by admins" ON explore_content;
DROP POLICY IF EXISTS "Explore content is editable by admins" ON explore_content;
DROP POLICY IF EXISTS "Published partners are viewable by everyone" ON partners;
DROP POLICY IF EXISTS "All partners are viewable by admins" ON partners;
DROP POLICY IF EXISTS "Partners are editable by admins" ON partners;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Categories are editable by admins" ON categories;
DROP POLICY IF EXISTS "Public site settings are viewable by everyone" ON site_settings;
DROP POLICY IF EXISTS "All site settings are viewable by admins" ON site_settings;
DROP POLICY IF EXISTS "Site settings are editable by admins" ON site_settings;
DROP POLICY IF EXISTS "Project partners are viewable by everyone" ON project_partners;
DROP POLICY IF EXISTS "Project partners are editable by admins" ON project_partners;
DROP POLICY IF EXISTS "Project team members are viewable by everyone" ON project_team_members;
DROP POLICY IF EXISTS "Project team members are editable by admins" ON project_team_members;
DROP POLICY IF EXISTS "Contact submissions are viewable by admins" ON contact_submissions;
DROP POLICY IF EXISTS "Contact submissions can be created by anyone" ON contact_submissions;
DROP POLICY IF EXISTS "Contact submissions are editable by admins" ON contact_submissions;
DROP POLICY IF EXISTS "Admin profiles are viewable by authenticated users" ON admin_profiles;
DROP POLICY IF EXISTS "Admin profiles are editable by profile owner or super admin" ON admin_profiles;
DROP POLICY IF EXISTS "Activity logs are viewable by admins" ON activity_logs;
DROP POLICY IF EXISTS "Activity logs are insertable by admins" ON activity_logs;
DROP POLICY IF EXISTS "Admin activity logs are viewable by admins" ON admin_activity_logs;
DROP POLICY IF EXISTS "Admin activity logs are insertable by admins" ON admin_activity_logs;

-- Drop all policy variations that might use functions
DROP POLICY IF EXISTS "projects_public_read" ON projects;
DROP POLICY IF EXISTS "projects_auth_all" ON projects;
DROP POLICY IF EXISTS "projects_public_select" ON projects;
DROP POLICY IF EXISTS "projects_auth_modify" ON projects;
DROP POLICY IF EXISTS "projects_public_published" ON projects;
DROP POLICY IF EXISTS "projects_service_all" ON projects;
DROP POLICY IF EXISTS "projects_admin_access" ON projects;
DROP POLICY IF EXISTS "services_public_read" ON services;
DROP POLICY IF EXISTS "services_auth_all" ON services;
DROP POLICY IF EXISTS "services_admin_access" ON services;
DROP POLICY IF EXISTS "team_members_public_read" ON team_members;
DROP POLICY IF EXISTS "team_members_admin_access" ON team_members;
DROP POLICY IF EXISTS "explore_content_public_read" ON explore_content;
DROP POLICY IF EXISTS "explore_content_admin_access" ON explore_content;
DROP POLICY IF EXISTS "partners_public_read" ON partners;
DROP POLICY IF EXISTS "partners_admin_access" ON partners;
DROP POLICY IF EXISTS "categories_public_read" ON categories;
DROP POLICY IF EXISTS "categories_admin_write" ON categories;
DROP POLICY IF EXISTS "site_settings_public_read" ON site_settings;
DROP POLICY IF EXISTS "site_settings_admin_access" ON site_settings;
DROP POLICY IF EXISTS "project_partners_public_read" ON project_partners;
DROP POLICY IF EXISTS "project_partners_admin_access" ON project_partners;
DROP POLICY IF EXISTS "project_team_members_public_read" ON project_team_members;
DROP POLICY IF EXISTS "project_team_members_admin_access" ON project_team_members;
DROP POLICY IF EXISTS "contact_submissions_public_insert" ON contact_submissions;
DROP POLICY IF EXISTS "contact_submissions_admin_access" ON contact_submissions;
DROP POLICY IF EXISTS "admin_profiles_self_access" ON admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_service_role" ON admin_profiles;
DROP POLICY IF EXISTS "admin_activity_logs_admin_only" ON admin_activity_logs;

-- Third, now drop the functions (after all dependent policies are dropped)
DROP FUNCTION IF EXISTS log_admin_activity();
DROP FUNCTION IF EXISTS is_admin(UUID);
DROP FUNCTION IF EXISTS get_admin_profile(UUID);
DROP FUNCTION IF EXISTS is_admin_secure(UUID);
DROP FUNCTION IF EXISTS check_admin_status(UUID);

-- ====================
-- PART 2: SCHEMA CORRECTIONS
-- ====================

-- Fix admin_profiles table to match database-types.ts
ALTER TABLE admin_profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;

-- Create missing admin_activity_logs table (renamed from activity_logs in database-types.ts)
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================
-- PART 3: SECURITY FUNCTIONS
-- ====================

-- Create secure admin check function with proper error handling
CREATE OR REPLACE FUNCTION is_admin_secure(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
DECLARE
  admin_exists BOOLEAN := FALSE;
BEGIN
  -- Return false if no user provided
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
    -- Log error and return false for security
    RAISE LOG 'Error in is_admin_secure: %', SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if user is admin
  IF is_admin_secure(auth.uid()) THEN
    INSERT INTO admin_activity_logs (user_id, action, entity_type, entity_id, details)
    VALUES (
      auth.uid(),
      TG_OP,
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      json_build_object(
        'old', to_jsonb(OLD),
        'new', to_jsonb(NEW)
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
EXCEPTION
  WHEN OTHERS THEN
    -- Don't fail the main operation if logging fails
    RAISE LOG 'Error logging admin activity: %', SQLERRM;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================
-- PART 4: ENABLE RLS
-- ====================

-- Enable RLS on all tables
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- ====================
-- PART 5: ADMIN PROFILES POLICIES (FOUNDATION)
-- ====================

-- Admin profiles - self-access and service role bypass
CREATE POLICY "admin_profiles_self_access" ON admin_profiles
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admin profiles - service role bypass (for API routes)
CREATE POLICY "admin_profiles_service_role" ON admin_profiles
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ====================
-- PART 6: PUBLIC CONTENT POLICIES
-- ====================

-- Categories - public read, admin write
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT 
  USING (true);

CREATE POLICY "categories_admin_write" ON categories
  FOR ALL 
  USING (is_admin_secure())
  WITH CHECK (is_admin_secure());

-- Services - public read for published, admin full access
CREATE POLICY "services_public_read" ON services
  FOR SELECT 
  USING (is_published = true);

CREATE POLICY "services_admin_access" ON services
  FOR ALL 
  USING (is_admin_secure())
  WITH CHECK (is_admin_secure());

-- Projects - public read for published, admin full access
CREATE POLICY "projects_public_read" ON projects
  FOR SELECT 
  USING (is_published = true);

CREATE POLICY "projects_admin_access" ON projects
  FOR ALL 
  USING (is_admin_secure())
  WITH CHECK (is_admin_secure());

-- Team members - public read for published, admin full access
CREATE POLICY "team_members_public_read" ON team_members
  FOR SELECT 
  USING (is_published = true);

CREATE POLICY "team_members_admin_access" ON team_members
  FOR ALL 
  USING (is_admin_secure())
  WITH CHECK (is_admin_secure());

-- Explore content - public read for published, admin full access
CREATE POLICY "explore_content_public_read" ON explore_content
  FOR SELECT 
  USING (is_published = true);

CREATE POLICY "explore_content_admin_access" ON explore_content
  FOR ALL 
  USING (is_admin_secure())
  WITH CHECK (is_admin_secure());

-- Partners - public read for published, admin full access
CREATE POLICY "partners_public_read" ON partners
  FOR SELECT 
  USING (is_published = true);

CREATE POLICY "partners_admin_access" ON partners
  FOR ALL 
  USING (is_admin_secure())
  WITH CHECK (is_admin_secure());

-- ====================
-- PART 7: RELATIONSHIP TABLES
-- ====================

-- Project partners - public read, admin write
CREATE POLICY "project_partners_public_read" ON project_partners
  FOR SELECT 
  USING (true);

CREATE POLICY "project_partners_admin_access" ON project_partners
  FOR ALL 
  USING (is_admin_secure())
  WITH CHECK (is_admin_secure());

-- Project team members - public read, admin write
CREATE POLICY "project_team_members_public_read" ON project_team_members
  FOR SELECT 
  USING (true);

CREATE POLICY "project_team_members_admin_access" ON project_team_members
  FOR ALL 
  USING (is_admin_secure())
  WITH CHECK (is_admin_secure());

-- ====================
-- PART 8: ADMIN-ONLY TABLES
-- ====================

-- Contact submissions - public insert, admin read/update/delete
CREATE POLICY "contact_submissions_public_insert" ON contact_submissions
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "contact_submissions_admin_access" ON contact_submissions
  FOR ALL 
  USING (is_admin_secure())
  WITH CHECK (is_admin_secure());

-- Site settings - public read for public settings, admin full access
CREATE POLICY "site_settings_public_read" ON site_settings
  FOR SELECT 
  USING (is_public = true);

CREATE POLICY "site_settings_admin_access" ON site_settings
  FOR ALL 
  USING (is_admin_secure())
  WITH CHECK (is_admin_secure());

-- Admin activity logs - admin only
CREATE POLICY "admin_activity_logs_admin_only" ON admin_activity_logs
  FOR ALL 
  USING (is_admin_secure())
  WITH CHECK (is_admin_secure());

-- ====================
-- PART 9: ACTIVITY LOGGING TRIGGERS
-- ====================

-- Add activity logging triggers to main tables
CREATE TRIGGER projects_activity_trigger
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW EXECUTE FUNCTION log_admin_activity();

CREATE TRIGGER team_members_activity_trigger
  AFTER INSERT OR UPDATE OR DELETE ON team_members
  FOR EACH ROW EXECUTE FUNCTION log_admin_activity();

CREATE TRIGGER services_activity_trigger
  AFTER INSERT OR UPDATE OR DELETE ON services
  FOR EACH ROW EXECUTE FUNCTION log_admin_activity();

CREATE TRIGGER explore_content_activity_trigger
  AFTER INSERT OR UPDATE OR DELETE ON explore_content
  FOR EACH ROW EXECUTE FUNCTION log_admin_activity();

CREATE TRIGGER partners_activity_trigger
  AFTER INSERT OR UPDATE OR DELETE ON partners
  FOR EACH ROW EXECUTE FUNCTION log_admin_activity();

-- ====================
-- PART 10: PERMISSIONS
-- ====================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, service_role;

-- ====================
-- PART 11: SAMPLE DATA
-- ====================

-- Insert sample categories if they don't exist
INSERT INTO categories (name, slug, description, color, sort_order) VALUES
('Residential', 'residential', 'Residential architecture projects', '#3B82F6', 1),
('Commercial', 'commercial', 'Commercial and office buildings', '#10B981', 2),
('Cultural', 'cultural', 'Cultural and heritage projects', '#F59E0B', 3),
('Healthcare', 'healthcare', 'Healthcare and wellness facilities', '#EF4444', 4),
('Educational', 'educational', 'Educational institutions', '#8B5CF6', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample services if they don't exist
INSERT INTO services (name, slug, description, service_type, icon, is_published, sort_order) VALUES
('Architectural Design', 'architectural-design', 'Complete architectural design services from concept to completion', 'design', 'building', true, 1),
('Interior Design', 'interior-design', 'Interior space planning and design', 'design', 'home', true, 2),
('Cultural Consultation', 'cultural-consultation', 'Expert guidance on culturally appropriate design practices', 'consultation', 'users', true, 3),
('Sustainable Planning', 'sustainable-planning', 'Environmentally conscious design solutions', 'planning', 'leaf', true, 4),
('Project Management', 'project-management', 'Complete project oversight and coordination', 'management', 'settings', true, 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample site settings if they don't exist
INSERT INTO site_settings (key, value, description, data_type, category, is_public) VALUES
('site_title', 'Office of Native Architects', 'Main site title', 'string', 'general', true),
('site_description', 'Modern architectural practice focused on effectuality, integrity, efficiency, and coexistence', 'Site description', 'string', 'general', true),
('contact_email', 'info@ona.com', 'Contact email address', 'string', 'contact', true),
('contact_phone', '+1-555-0123', 'Contact phone number', 'string', 'contact', true),
('office_address', '123 Architecture Street, Design City, DC 12345', 'Office address', 'string', 'contact', true),
('social_linkedin', 'https://linkedin.com/company/ona', 'LinkedIn profile URL', 'string', 'social', true),
('social_instagram', 'https://instagram.com/ona_architects', 'Instagram profile URL', 'string', 'social', true),
('social_twitter', 'https://twitter.com/ona_architects', 'Twitter profile URL', 'string', 'social', true),
('homepage_hero_title', 'Designing the Future', 'Homepage hero title', 'string', 'content', true),
('homepage_hero_subtitle', 'Architecture rooted in effectuality, integrity, efficiency, and coexistence', 'Homepage hero subtitle', 'string', 'content', true),
('projects_per_page', '12', 'Number of projects per page', 'number', 'display', true),
('enable_contact_form', 'true', 'Enable contact form', 'boolean', 'features', true)
ON CONFLICT (key) DO NOTHING;

-- Success message
SELECT 'Database schema and RLS policies configured successfully!' as status;