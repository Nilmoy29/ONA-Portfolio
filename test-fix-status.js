const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Test with anonymous client (same as the website uses)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCurrentStatus() {
  console.log('Testing current RLS status...\n');
  
  const tests = [
    { table: 'projects', description: 'Projects' },
    { table: 'services', description: 'Services' },
    { table: 'team_members', description: 'Team Members' },
    { table: 'partners', description: 'Partners' },
    { table: 'explore_content', description: 'Explore Content' },
    { table: 'categories', description: 'Categories' }
  ];
  
  let allPassed = true;
  
  for (const test of tests) {
    try {
      let query = supabase.from(test.table).select('id').limit(1);
      
      // Categories table doesn't have is_published column
      if (test.table !== 'categories') {
        query = query.eq('is_published', true);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.log(`❌ ${test.description}: ${error.message}`);
        allPassed = false;
      } else {
        console.log(`✅ ${test.description}: Working`);
      }
    } catch (err) {
      console.log(`❌ ${test.description}: ${err.message}`);
      allPassed = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allPassed) {
    console.log('🎉 All tests passed! RLS fix has been applied successfully.');
  } else {
    console.log('⚠️  Some tests failed. You need to apply the RLS fix.');
    console.log('\nTo fix this:');
    console.log('1. Go to https://supabase.com/dashboard/project/oscicdyjpnnykyqpvuys');
    console.log('2. Navigate to Database → SQL Editor');
    console.log('3. Copy and paste the contents of scripts/manual-rls-fix.sql');
    console.log('4. Click "Run" to execute the SQL');
    console.log('5. Refresh your website');
  }
}

testCurrentStatus();