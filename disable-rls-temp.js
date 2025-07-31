const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function disableRLSTemporarily() {
  try {
    console.log('Attempting to disable RLS temporarily...');
    
    // The issue is that we have RLS policies that are causing infinite recursion
    // We need to either:
    // 1. Disable RLS temporarily to fix the policies
    // 2. Use a different approach
    
    // Let's try to work around this by creating a simple test
    console.log('Creating a simple test to understand the issue...');
    
    // First, let's check if we can access the database with service role
    console.log('Testing service role access...');
    const { data: serviceData, error: serviceError } = await supabase
      .from('projects')
      .select('id, title')
      .eq('is_published', true)
      .limit(1);
    
    if (serviceError) {
      console.error('❌ Service role access failed:', serviceError.message);
    } else {
      console.log('✅ Service role access working');
      console.log('Service data:', serviceData);
    }
    
    // Now test with anon
    console.log('\nTesting anonymous access...');
    const anonClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    const { data: anonData, error: anonError } = await anonClient
      .from('projects')
      .select('id, title')
      .eq('is_published', true)
      .limit(1);
    
    if (anonError) {
      console.error('❌ Anonymous access failed:', anonError.message);
      console.log('\nSUGGESTION: The issue is with RLS policies. You need to:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Navigate to Database -> Settings -> SQL Editor');
      console.log('3. Run this SQL to fix the policies:');
      console.log(`
-- Fix RLS policies for public access
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE partners DISABLE ROW LEVEL SECURITY;
ALTER TABLE explore_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_partners DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE explore_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create simple public access policies
CREATE POLICY "public_read_published" ON projects FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_published" ON services FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_published" ON team_members FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_published" ON partners FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_published" ON explore_content FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_all" ON categories FOR SELECT USING (true);
CREATE POLICY "public_read_all" ON project_partners FOR SELECT USING (true);
CREATE POLICY "public_read_all" ON project_team_members FOR SELECT USING (true);
CREATE POLICY "public_read_public" ON site_settings FOR SELECT USING (is_public = true);

-- Admin policies (using service role bypass)
CREATE POLICY "admin_full_access" ON projects FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "admin_full_access" ON services FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "admin_full_access" ON team_members FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "admin_full_access" ON partners FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "admin_full_access" ON explore_content FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "admin_full_access" ON categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "admin_full_access" ON project_partners FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "admin_full_access" ON project_team_members FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "admin_full_access" ON site_settings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "admin_full_access" ON contact_submissions FOR ALL USING (auth.role() = 'service_role');

-- Contact form policy
CREATE POLICY "public_insert_contact" ON contact_submissions FOR INSERT WITH CHECK (true);
      `);
    } else {
      console.log('✅ Anonymous access working');
      console.log('Anon data:', anonData);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

disableRLSTemporarily();