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

async function testDatabaseConnections() {
  try {
    console.log('Testing database connections...');
    
    // Test each table individually
    const tables = ['projects', 'services', 'team_members', 'partners', 'explore_content'];
    
    for (const table of tables) {
      console.log(`Testing ${table} table...`);
      
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .eq('is_published', true)
          .limit(1);
        
        if (error) {
          console.error(`❌ ${table} error:`, error.message);
        } else {
          console.log(`✅ ${table} working fine`);
        }
      } catch (err) {
        console.error(`❌ ${table} exception:`, err.message);
      }
    }
    
    // Test admin_profiles specifically
    console.log('\nTesting admin_profiles table...');
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('id, full_name, role')
        .limit(1);
      
      if (error) {
        console.error('❌ admin_profiles error:', error.message);
      } else {
        console.log('✅ admin_profiles working fine');
        console.log('Sample data:', data);
      }
    } catch (err) {
      console.error('❌ admin_profiles exception:', err.message);
    }
    
  } catch (error) {
    console.error('General error:', error);
  }
}

testDatabaseConnections();