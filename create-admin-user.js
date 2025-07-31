const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  console.log('🔧 Setting up admin user...\n');

  // Create admin user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'admin@ona.com',
    password: 'admin123',
    email_confirm: true
  });

  if (authError) {
    console.error('❌ Error creating admin user:', authError.message);
    return;
  }

  console.log('✅ Admin user created successfully');
  console.log('📧 Email: admin@ona.com');
  console.log('🔑 Password: admin123');
  
  // Try to create admin profile (might fail if table doesn't exist)
  try {
    const { data: profileData, error: profileError } = await supabase
      .from('admin_profiles')
      .insert({
        user_id: authData.user.id,
        role: 'admin',
        permissions: {},
        is_active: true
      })
      .select()
      .single();

    if (profileError) {
      console.log('⚠️  Admin profile creation failed (this is expected if table doesn\'t exist):', profileError.message);
      console.log('💡 The app will create a temporary admin profile automatically');
    } else {
      console.log('✅ Admin profile created successfully');
    }
  } catch (error) {
    console.log('⚠️  Admin profile creation failed:', error.message);
  }

  console.log('\n🎉 Setup completed!');
  console.log('📋 Next steps:');
  console.log('1. Visit http://localhost:3005/admin/login');
  console.log('2. Sign in with: admin@ona.com / admin123');
  console.log('3. The app will automatically create admin privileges');
}

createAdminUser().catch(console.error);