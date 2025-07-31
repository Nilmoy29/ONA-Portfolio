-- Fix RLS Infinite Recursion Issue
-- This script fixes the circular reference in admin_profiles policies

-- ====================
-- PART 1: DROP PROBLEMATIC POLICIES
-- ====================

-- Drop all policies that might cause recursion
DROP POLICY IF EXISTS "admin_profiles_self_access" ON admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_service_role" ON admin_profiles;

-- ====================
-- PART 2: CREATE SAFE ADMIN PROFILES POLICIES
-- ====================

-- Admin profiles - direct auth check without calling is_admin_secure()
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
-- PART 3: UPDATE ADMIN CHECK FUNCTION
-- ====================

-- Create a version of is_admin_secure that doesn't cause recursion
CREATE OR REPLACE FUNCTION is_admin_secure(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
DECLARE
  admin_exists BOOLEAN := FALSE;
BEGIN
  -- Return false if no user provided
  IF check_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- For service role, always return true (bypass for API routes)
  IF auth.role() = 'service_role' THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user has active admin profile
  -- Use a direct query that won't trigger RLS policies
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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION is_admin_secure TO authenticated, service_role;

-- Success message
SELECT 'RLS recursion issue fixed!' as status;