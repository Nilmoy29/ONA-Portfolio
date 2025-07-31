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

async function fixPublicRLS() {
  try {
    console.log('Fixing public RLS policies...');
    
    // The problem is that our public read policies are using is_admin_secure()
    // which requires authentication. We need to enable public access for published content.
    
    // First, let's disable RLS temporarily to fix the policies
    console.log('Temporarily disabling RLS to fix policies...');
    
    const fixQueries = [
      // Grant necessary permissions to anon role
      'GRANT SELECT ON projects TO anon;',
      'GRANT SELECT ON services TO anon;',
      'GRANT SELECT ON team_members TO anon;',
      'GRANT SELECT ON partners TO anon;',
      'GRANT SELECT ON explore_content TO anon;',
      'GRANT SELECT ON categories TO anon;',
      'GRANT SELECT ON project_partners TO anon;',
      'GRANT SELECT ON project_team_members TO anon;',
      'GRANT SELECT ON site_settings TO anon;',
      
      // Grant insert on contact_submissions to anon
      'GRANT INSERT ON contact_submissions TO anon;',
    ];
    
    for (const query of fixQueries) {
      try {
        console.log(`Executing: ${query}`);
        const { error } = await supabase.rpc('exec_raw_sql', { query });
        if (error) {
          console.error('Error:', error);
        } else {
          console.log('✅ Success');
        }
      } catch (err) {
        console.error('Exception:', err.message);
      }
    }
    
    // Test the fix
    console.log('\nTesting anonymous access after fix...');
    const anonClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    const { data: testData, error: testError } = await anonClient
      .from('projects')
      .select('id, title')
      .eq('is_published', true)
      .limit(1);
    
    if (testError) {
      console.error('❌ Test failed:', testError.message);
    } else {
      console.log('✅ Anonymous access test passed!');
      console.log('Sample data:', testData);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

fixPublicRLS();