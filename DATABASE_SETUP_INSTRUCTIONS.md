# Database Setup Instructions for ONA Portfolio

## Overview
This document provides comprehensive instructions for setting up the database schema, RLS policies, and admin authentication for the ONA Portfolio project.

## Issues Fixed
1. **Database Schema Inconsistency** - Fixed missing columns and table mismatches
2. **RLS Circular Dependencies** - Resolved infinite loops in admin policies
3. **Missing Admin User** - Created proper admin user setup process
4. **Broken Admin Auth Flow** - Fixed authentication with proper RLS policies
5. **Security Vulnerabilities** - Implemented proper security policies

## Setup Process

### Step 1: Run Database Schema Fix
Execute the comprehensive database fix script:

```bash
# Run the schema fix script in your Supabase SQL editor
psql -h your-host -p 5432 -U your-user -d your-db < scripts/comprehensive-database-fix.sql
```

Or copy and paste the contents of `scripts/comprehensive-database-fix.sql` into your Supabase SQL editor.

### Step 2: Create Admin User
You need to create the admin user through the Supabase dashboard:

1. Go to your Supabase dashboard
2. Navigate to Authentication > Users
3. Click "Add User"
4. Fill in the details:
   - **Email**: `admin@ona.com`
   - **Password**: `admin123456`
   - **Auto Confirm User**: Yes (check this box)
5. Click "Create User"

### Step 3: Create Admin Profile
After creating the admin user, run the admin profile creation script:

```sql
-- Run this in your Supabase SQL editor
SELECT create_admin_profile('admin@ona.com');
```

### Step 4: Verify Setup
Run the verification script to ensure everything is working:

```bash
node scripts/test-crud-operations.js
```

### Step 5: Update Code (if needed)
If you want to use the improved auth context, replace the current auth context:

```bash
# Backup current auth context
mv lib/auth-context.tsx lib/auth-context-backup.tsx

# Use the fixed version
mv lib/auth-context-fixed.tsx lib/auth-context.tsx
```

## Database Schema Overview

### Core Tables
- `admin_profiles` - Admin user profiles with roles and permissions
- `admin_activity_logs` - Activity logging for admin actions
- `categories` - Project categories
- `projects` - Architecture projects
- `team_members` - Team member profiles
- `services` - Services offered
- `explore_content` - Blog/content articles
- `partners` - Partner organizations
- `contact_submissions` - Contact form submissions
- `site_settings` - Site configuration

### Relationship Tables
- `project_partners` - Many-to-many projects and partners
- `project_team_members` - Many-to-many projects and team members

## RLS Policies Overview

### Security Model
The database uses a three-tier security model:

1. **Public Access** - Anonymous users can read published content
2. **Admin Access** - Admin users have full CRUD access to all content
3. **Service Role** - Backend API has full access for server-side operations

### Policy Types

#### Public Read Policies
- Published projects, services, team members, explore content, partners
- Categories (all)
- Project relationships (all)
- Public site settings

#### Admin-Only Policies
- All admin_profiles operations (except service role)
- All admin_activity_logs operations
- All contact_submissions read/update/delete
- All site_settings write operations
- All content write operations

#### Mixed Policies
- Contact submissions: Public insert, admin read/update/delete
- Site settings: Public read (public only), admin full access

## Admin Authentication Flow

### 1. User Sign-in
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@ona.com',
  password: 'admin123456'
})
```

### 2. Profile Fetching
```typescript
const { data: profile } = await supabaseAdmin
  .from('admin_profiles')
  .select('*')
  .eq('user_id', userId)
  .eq('is_active', true)
  .single()
```

### 3. Permission Check
```typescript
const isAdmin = !!(user && adminProfile && 
  (adminProfile.role === 'admin' || adminProfile.role === 'super_admin') && 
  adminProfile.is_active)
```

## CRUD Operations

### Projects Example
```typescript
// Create (Admin only)
const { data: project } = await supabase
  .from('projects')
  .insert({
    title: 'New Project',
    slug: 'new-project',
    description: 'Project description',
    is_published: true
  })

// Read (Public for published, Admin for all)
const { data: projects } = await supabase
  .from('projects')
  .select('*')
  .eq('is_published', true) // Public access
  // No filter for admin access

// Update (Admin only)
const { data: updated } = await supabase
  .from('projects')
  .update({ title: 'Updated Project' })
  .eq('id', projectId)

// Delete (Admin only)
const { error } = await supabase
  .from('projects')
  .delete()
  .eq('id', projectId)
```

## Security Functions

### is_admin_secure(user_id)
Checks if a user has an active admin profile. Used in RLS policies.

```sql
CREATE OR REPLACE FUNCTION is_admin_secure(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
-- Implementation checks admin_profiles table
$$;
```

### log_admin_activity()
Trigger function that logs admin actions to admin_activity_logs table.

```sql
CREATE OR REPLACE FUNCTION log_admin_activity()
RETURNS TRIGGER AS $$
-- Implementation logs INSERT/UPDATE/DELETE operations
$$;
```

## Testing

### Manual Testing
1. **Public Access**: Visit the main site and verify content loads
2. **Admin Login**: Go to `/admin/login` and sign in with admin credentials
3. **Admin Dashboard**: Verify admin functions work in `/admin/dashboard`
4. **CRUD Operations**: Test creating, reading, updating, and deleting content

### Automated Testing
Run the comprehensive test script:
```bash
node scripts/test-crud-operations.js
```

This tests:
- Table existence
- Admin user and profile creation
- CRUD operations on all main tables
- RLS policy enforcement
- Public vs admin access patterns

## Troubleshooting

### Common Issues

#### Admin Login Fails
- Check if admin user exists in auth.users
- Verify admin_profiles record exists and is_active = true
- Check browser console for detailed error messages

#### RLS Policy Errors
- Verify functions `is_admin_secure` exists
- Check if policies are enabled on tables
- Confirm user has active admin profile

#### Database Connection Issues
- Verify environment variables are set correctly
- Check Supabase project URL and keys
- Ensure database is accessible

### Debug Commands

```sql
-- Check admin user exists
SELECT * FROM auth.users WHERE email = 'admin@ona.com';

-- Check admin profile exists
SELECT * FROM admin_profiles WHERE user_id = 'USER_ID_HERE';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public';

-- Check functions exist
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%admin%';
```

## Maintenance

### Regular Tasks
1. **Monitor Activity Logs**: Check admin_activity_logs for unusual activity
2. **Update Admin Profiles**: Manage admin user permissions as needed
3. **Review RLS Policies**: Ensure policies meet security requirements
4. **Test Authentication**: Regularly verify admin login works

### Backup Strategy
- Database schema and policies are defined in code
- Regular Supabase backups cover data
- Environment variables should be securely stored
- Admin credentials should be rotated periodically

## Security Considerations

### Best Practices
1. **Use Strong Passwords**: Admin password should be complex
2. **Rotate Credentials**: Change admin password regularly
3. **Monitor Access**: Review admin_activity_logs regularly
4. **Principle of Least Privilege**: Only grant necessary permissions
5. **Regular Updates**: Keep Supabase and dependencies updated

### Security Policies
- Admin profiles can only be created by service role
- Activity logging is automatic and cannot be disabled by users
- RLS policies prevent unauthorized access to sensitive data
- Service role access is restricted to backend operations

## Performance Optimization

### Database Indexes
The schema includes appropriate indexes for:
- Primary keys (automatic)
- Foreign keys (automatic)
- Frequently queried columns (slug, email, is_published)

### Query Optimization
- Use select() to limit returned columns
- Apply filters early in query chain
- Use single() for single record queries
- Implement pagination for large datasets

## Conclusion

This setup provides a robust, secure foundation for the ONA Portfolio project with:
- Proper database schema matching TypeScript types
- Secure RLS policies preventing unauthorized access
- Working admin authentication system
- Comprehensive logging and monitoring
- Full CRUD capabilities for all content types

The system is designed to be maintainable, secure, and scalable for future requirements.