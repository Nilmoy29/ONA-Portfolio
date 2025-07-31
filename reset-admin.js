const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resetAdmin() {
  console.log('🔧 Resetting admin user...\n');

  // List all users to find admin
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('❌ Error listing users:', listError.message);
    return;
  }

  console.log('👥 Found users:');
  users.users.forEach(user => {
    console.log(`  - ${user.email} (${user.id})`);
  });

  // Find admin user
  const adminUser = users.users.find(u => u.email === 'admin@ona.com');
  
  if (!adminUser) {
    console.log('❌ Admin user not found, creating new one...');
    
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: 'admin@ona.com',
      password: 'admin123456',
      email_confirm: true
    });

    if (createError) {
      console.error('❌ Error creating admin user:', createError.message);
      return;
    }

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@ona.com');
    console.log('🔑 Password: admin123456');
  } else {
    console.log('✅ Admin user found, updating password...');
    
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      { password: 'admin123456' }
    );

    if (updateError) {
      console.error('❌ Error updating password:', updateError.message);
      return;
    }

    console.log('✅ Password updated successfully');
    console.log('📧 Email: admin@ona.com');
    console.log('🔑 Password: admin123456');
  }

  console.log('\n🎉 Admin user ready!');
  console.log('📋 Next steps:');
  console.log('1. Visit http://localhost:3005/admin/login');
  console.log('2. Sign in with: admin@ona.com / admin123456');
}

resetAdmin().catch(console.error);