# Infinite Recursion RLS Policy Fix

## Problem Description

The application was experiencing infinite recursion errors when trying to fetch data from the database. The specific error was:

```
Error fetching projects: "infinite recursion detected in policy for relation \"admin_profiles\""
```

This error was affecting multiple tables:
- `projects`
- `services` 
- `explore_content`
- `team_members`
- `partners`

## Root Cause

The issue was caused by circular references in Row Level Security (RLS) policies. Multiple tables had policies that referenced the `admin_profiles` table to check if a user was an admin, but the `admin_profiles` table itself had a policy that queried itself, creating infinite recursion.

### Problematic Policy Examples

1. **admin_profiles table**:
   ```sql
   -- This policy queries admin_profiles from within admin_profiles (infinite recursion)
   CREATE POLICY "Admins can read admin profiles" ON admin_profiles
   FOR SELECT USING (
     auth.uid() IN (
       SELECT admin_profiles_1.id 
       FROM admin_profiles admin_profiles_1 
       WHERE admin_profiles_1.role = ANY(ARRAY['admin', 'editor'])
     )
   );
   ```

2. **Other tables**:
   ```sql
   -- These policies query admin_profiles, which has its own recursive policy
   CREATE POLICY "Admins can manage all content" ON projects
   FOR ALL USING (
     auth.uid() IN (
       SELECT admin_profiles.id 
       FROM admin_profiles 
       WHERE admin_profiles.role = ANY(ARRAY['admin', 'editor'])
     )
   );
   ```

## Solution

### 1. Removed All Conflicting Policies

We systematically removed all RLS policies that created circular dependencies:

- All policies on `admin_profiles` that referenced itself
- All policies on content tables that referenced `admin_profiles`
- All redundant and conflicting policies across all tables

### 2. Implemented Simple, Non-Recursive Policies

We replaced the complex policies with simple ones that don't reference other tables:

```sql
-- Service role gets full access (for API operations)
CREATE POLICY "table_service_full" ON table_name
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Public gets read access to published content
CREATE POLICY "table_public_read" ON table_name
    FOR SELECT TO public USING (is_published = true);

-- Users can access their own data (for admin_profiles)
CREATE POLICY "admin_profiles_own_read" ON admin_profiles
    FOR SELECT TO authenticated USING (auth.uid() = id);
```

### 3. Tables Fixed

The following tables were cleaned up and given new simple policies:

- `admin_profiles`
- `projects`
- `services`
- `explore_content`
- `team_members`
- `partners`
- `contact_submissions`
- `site_settings`
- `project_partners`
- `project_team_members`
- `admin_activity_logs`
- `activity_logs`
- `newsletter_subscribers`
- `job_openings`
- `media_files`
- `media_folders`

## Benefits of the New Approach

1. **No Infinite Recursion**: Policies don't reference other tables that might have their own recursive policies
2. **Better Performance**: Simple role-based checks are much faster than complex table lookups
3. **Easier to Maintain**: Policies are straightforward and don't have hidden dependencies
4. **More Reliable**: Less likely to break when making changes to other tables

## How Admin Access is Now Handled

Instead of using RLS policies to check admin status, admin access is now handled:

1. **Via Service Role**: All admin operations use the service role key, which bypasses RLS
2. **In Application Logic**: Admin checks are done in the application layer before making database calls
3. **Via Direct User Checks**: For user-specific data like profiles, we check `auth.uid() = user_id`

## Verification

After the fix, all queries now work without recursion errors:

- ✅ Projects: 5 published items
- ✅ Services: 8 published items  
- ✅ Team Members: 2 published items
- ✅ Explore Content: 3 published items
- ✅ Partners: 5 published items
- ✅ Admin Profiles: 1 admin user

## Migration Files Applied

1. `fix_rls_infinite_recursion` - Initial policy cleanup attempt
2. `cleanup_all_recursive_rls_policies` - Complete removal of problematic policies
3. `create_simple_rls_policies` - New simple policies for main content tables
4. `fix_remaining_rls_policies` - Cleanup of remaining tables
5. `fix_remaining_policies_final` - Final cleanup and creation of simple policies

## Prevention Guidelines

To prevent this issue in the future:

1. **Avoid Cross-Table References**: Don't create RLS policies that query other tables
2. **Use Service Role for Admin**: Admin operations should use service role, not complex policies
3. **Keep Policies Simple**: Use basic role checks (`service_role`, `authenticated`, `public`)
4. **Test Thoroughly**: Always test new policies with actual queries to check for recursion
5. **Document Dependencies**: If policies must reference other tables, document the relationships clearly 