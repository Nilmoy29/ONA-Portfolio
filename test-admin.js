const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAdmin() {
  console.log('🔍 Testing admin setup...\n');

  // Test sign in
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'admin@ona.com',
    password: 'admin123456'
  });

  if (signInError) {
    console.error('❌ Sign in failed:', signInError.message);
    return;
  }

  console.log('✅ Sign in successful');
  console.log('👤 User ID:', signInData.user.id);

  // Test admin_profiles table
  try {
    const { data: profileData, error: profileError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('user_id', signInData.user.id)
      .single();

    if (profileError) {
      console.log('⚠️  Admin profile query failed:', profileError.message);
      console.log('💡 This is expected if admin_profiles table doesn\'t exist');
    } else {
      console.log('✅ Admin profile found:', profileData);
    }
  } catch (error) {
    console.log('⚠️  Admin profile test failed:', error.message);
  }

  // Test basic tables
  console.log('\n🔍 Testing basic tables...');
  
  const tables = ['projects', 'categories', 'services', 'explore_content'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Table exists (${data.length} rows)`);
      }
    } catch (error) {
      console.log(`❌ ${table}: ${error.message}`);
    }
  }

  console.log('\n🎉 Test completed!');
  console.log('📋 Summary:');
  console.log('- Admin user exists: ✅');
  console.log('- Admin can sign in: ✅');
  console.log('- Admin profile table: ⚠️  (Will be created temporarily by app)');
  console.log('- Core tables: Check results above');
}

testAdmin().catch(console.error);