# RLS (Row Level Security) Strategy for ONA Portfolio

## 🎯 **The Problem We Solved**

The original RLS implementation had **infinite recursion** because:
1. Content tables (projects, services, etc.) had policies that called `is_admin_secure()`
2. `is_admin_secure()` function queried the `admin_profiles` table
3. `admin_profiles` table had RLS policies that also called `is_admin_secure()`
4. This created an infinite loop: Policy → Function → Table → Policy → Function → ...

## 🔧 **The Solution: Direct Role-Based Policies**

### **Core Strategy:**
- **Avoid function calls in RLS policies** that might create recursion
- **Use direct role checks** (`auth.role()`, `auth.uid()`) instead of custom functions
- **Separate public and admin access** clearly using different roles

### **Role-Based Access Control:**

| Role | Description | Access Level |
|------|-------------|--------------|
| `anon` | Anonymous/public users | Read published content only |
| `authenticated` | Logged-in users | Read published content + own profile |
| `service_role` | Admin/API operations | Full access to everything |

## 📊 **Table-by-Table RLS Strategy**

### **1. Public Content Tables**
Tables: `projects`, `services`, `team_members`, `partners`, `explore_content`

**Strategy:**
- **Public Read**: Allow `anon` and `authenticated` users to read published content
- **Admin Full Access**: Allow `service_role` full CRUD operations

**Example Policy:**
```sql
-- Public can read published content
CREATE POLICY "projects_public_read" ON projects
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Service role has full access
CREATE POLICY "projects_admin_full" ON projects
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

### **2. Always-Public Tables**
Tables: `categories`, `project_partners`, `project_team_members`

**Strategy:**
- **Public Read**: Always allow read access (no `is_published` field)
- **Admin Full Access**: Service role for modifications

### **3. Semi-Public Tables**
Tables: `site_settings`

**Strategy:**
- **Selective Public Read**: Only settings marked as `is_public = true`
- **Admin Full Access**: Service role for all settings

### **4. Public-Insert Tables**
Tables: `contact_submissions`

**Strategy:**
- **Public Insert**: Allow anyone to submit contact forms
- **Admin Full Access**: Service role to read/manage submissions

### **5. Admin-Only Tables**
Tables: `admin_profiles`, `admin_activity_logs`

**Strategy:**
- **Self-Access**: Users can read/update their own profile
- **Service Role**: Full access for admin operations
- **No Function Calls**: Direct `auth.uid()` comparisons only

## 🛡️ **Security Benefits**

### **1. No Recursion**
- All policies use direct role checks
- No custom functions that query other RLS-protected tables
- Clean, predictable access control

### **2. Principle of Least Privilege**
- Anonymous users: Read published content only
- Authenticated users: Read published content + own profile
- Service role: Full admin access

### **3. Clear Separation**
- Public API routes use `anon` role
- Admin API routes use `service_role`
- User profile operations use `authenticated` role

## 🔄 **How It Works in Practice**

### **Public Website Access:**
1. User visits website
2. Client uses `anon` role (public key)
3. RLS allows reading published content
4. User sees projects, services, team members, etc.

### **Admin Dashboard Access:**
1. Admin logs into dashboard
2. Admin API routes use `service_role` (private key)
3. RLS allows full access to all tables
4. Admin can manage all content

### **User Profile Access:**
1. User authenticates
2. Client uses `authenticated` role
3. RLS allows reading own profile only
4. User can update their own information

## 📝 **Implementation Notes**

### **Key Design Decisions:**

1. **Service Role Bypass**: Admin operations use `service_role` which bypasses RLS entirely
2. **No Custom Functions**: All policies use built-in Supabase functions only
3. **Explicit Role Targeting**: Each policy specifies exactly which roles can access it
4. **Simple Boolean Checks**: Policies use simple field comparisons (`is_published = true`)

### **Why This Works:**
- **Predictable**: Easy to understand who can access what
- **Secure**: Clear boundaries between public and admin access
- **Maintainable**: No complex function dependencies
- **Scalable**: Easy to add new tables with similar patterns

## 🧪 **Testing the Implementation**

After applying the proper RLS policies, you can test:

1. **Public Access**: Anonymous users can read published content
2. **Admin Access**: Service role has full CRUD access
3. **No Recursion**: All queries execute without infinite loops
4. **Performance**: Direct role checks are faster than function calls

## 🔮 **Future Enhancements**

If you need more complex admin permissions in the future, consider:

1. **Role-Based Permissions**: Add specific roles like `editor`, `viewer`
2. **Resource-Based Access**: Allow users to access specific projects they own
3. **Audit Logging**: Track who accessed what and when

The current implementation provides a solid foundation that can be extended as needed without breaking the core security model.