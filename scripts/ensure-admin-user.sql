-- Ensure Admin User Exists
-- This script creates the demo admin user if it doesn't exist

-- ====================
-- PART 1: CHECK AND CREATE ADMIN USER
-- ====================

-- Check if admin user exists and create if needed
DO $$
DECLARE
  admin_user_id UUID;
  admin_profile_exists BOOLEAN;
BEGIN
  -- Look for existing admin user
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@ona.com' 
  LIMIT 1;
  
  -- If no admin user found, we need to inform the user
  IF admin_user_id IS NULL THEN
    RAISE NOTICE 'No admin user found with email: admin@ona.com';
    RAISE NOTICE 'Please create an admin user through Supabase Auth or update this script with the correct email.';
    RETURN;
  END IF;
  
  -- Check if admin profile exists
  SELECT EXISTS(
    SELECT 1 FROM admin_profiles 
    WHERE user_id = admin_user_id
  ) INTO admin_profile_exists;
  
  -- Create admin profile if it doesn't exist
  IF NOT admin_profile_exists THEN
    INSERT INTO admin_profiles (
      user_id,
      full_name,
      role,
      permissions,
      is_active,
      avatar_url
    ) VALUES (
      admin_user_id,
      'System Administrator',
      'super_admin',
      '{"can_manage_users": true, "can_manage_content": true, "can_manage_settings": true, "can_view_analytics": true, "can_manage_partners": true, "can_manage_projects": true, "can_manage_team": true, "can_manage_services": true, "can_manage_explore": true}'::jsonb,
      true,
      null
    );
    
    RAISE NOTICE 'Admin profile created for user: %', admin_user_id;
  ELSE
    -- Update existing profile to ensure it's active
    UPDATE admin_profiles 
    SET 
      is_active = true,
      permissions = '{"can_manage_users": true, "can_manage_content": true, "can_manage_settings": true, "can_view_analytics": true, "can_manage_partners": true, "can_manage_projects": true, "can_manage_team": true, "can_manage_services": true, "can_manage_explore": true}'::jsonb,
      updated_at = NOW()
    WHERE user_id = admin_user_id;
    
    RAISE NOTICE 'Admin profile updated for user: %', admin_user_id;
  END IF;
  
  RAISE NOTICE 'Admin user setup complete!';
END
$$;

-- ====================
-- PART 2: VERIFICATION QUERY
-- ====================

-- Show current admin users
SELECT 
  u.email,
  ap.full_name,
  ap.role,
  ap.is_active,
  ap.created_at
FROM auth.users u
JOIN admin_profiles ap ON u.id = ap.user_id
WHERE ap.is_active = true;