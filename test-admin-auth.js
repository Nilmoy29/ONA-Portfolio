const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🧪 Testing Admin Authentication...');
console.log('📍 Supabase URL:', supabaseUrl);
console.log('🔑 Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Missing environment variables');
  console.log('Please set:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdminAuth() {
  try {
    console.log('\n1️⃣ Checking current session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session Error:', sessionError);
      return;
    }
    
    if (!session) {
      console.log('⚠️ No active session found');
      console.log('💡 To test admin authentication, you need to:');
      console.log('1. Login through the admin interface first');
      console.log('2. Or create an admin user using the create-admin-user.js script');
      return;
    }
    
    console.log('✅ Active session found for user:', session.user.email);
    
    console.log('\n2️⃣ Checking admin profile...');
    const { data: adminProfile, error: profileError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .single();
    
    if (profileError) {
      console.error('❌ Admin Profile Error:', profileError);
      console.log('💡 User may not have admin privileges');
      return;
    }
    
    console.log('✅ Admin profile found:', {
      id: adminProfile.id,
      full_name: adminProfile.full_name,
      role: adminProfile.role,
      is_active: adminProfile.is_active
    });
    
    console.log('\n3️⃣ Testing partners access...');
    const { data: partners, error: partnersError } = await supabase
      .from('partners')
      .select('*')
      .limit(1);
    
    if (partnersError) {
      console.error('❌ Partners Access Error:', partnersError);
      console.log('💡 This could be an RLS policy issue');
      return;
    }
    
    console.log('✅ Partners table accessible');
    console.log('📊 Found', partners?.length || 0, 'partners');
    
    console.log('\n🎉 Admin authentication working correctly!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

async function checkAdminUsers() {
  try {
    console.log('\n🔍 Checking for admin users...');
    
    const { data: adminUsers, error } = await supabase
      .from('admin_profiles')
      .select('id, full_name, role, is_active')
      .eq('is_active', true);
      
    if (error) {
      console.error('❌ Error checking admin users:', error);
      return;
    }
    
    console.log('📊 Found', adminUsers?.length || 0, 'active admin users');
    
    if (adminUsers && adminUsers.length > 0) {
      adminUsers.forEach(admin => {
        console.log(`👤 ${admin.full_name} (${admin.role})`);
      });
    } else {
      console.log('⚠️ No admin users found');
      console.log('💡 Create an admin user first using: node create-admin-user.js');
    }
    
  } catch (error) {
    console.error('❌ Error checking admin users:', error);
  }
}

async function main() {
  await checkAdminUsers();
  await testAdminAuth();
}

main().catch(console.error); 