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

async function fixPublicAccess() {
  try {
    console.log('Fixing public access policies...');
    
    // Test current access with anon client
    const anonClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    console.log('Testing anonymous access to projects...');
    const { data: anonData, error: anonError } = await anonClient
      .from('projects')
      .select('id, title')
      .eq('is_published', true)
      .limit(1);
    
    if (anonError) {
      console.error('❌ Anonymous access failed:', anonError.message);
      console.log('This confirms the RLS issue. The anon role cannot access published content.');
      
      // Let's check the actual RLS policies
      console.log('\nChecking RLS policies...');
      const { data: policies, error: policyError } = await supabase
        .from('pg_policies')
        .select('*')
        .eq('schemaname', 'public')
        .eq('tablename', 'projects');
      
      if (policyError) {
        console.error('Error checking policies:', policyError);
      } else {
        console.log('Current policies:', policies);
      }
      
    } else {
      console.log('✅ Anonymous access working fine');
      console.log('Sample data:', anonData);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

fixPublicAccess();