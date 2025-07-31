const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugAuth() {
  console.log('🔍 Debugging authentication...\n');
  
  console.log('📋 Configuration:');
  console.log('- URL:', supabaseUrl);
  console.log('- Key:', supabaseAnonKey.substring(0, 50) + '...');
  
  console.log('\n🧪 Testing different credentials:');
  
  const credentials = [
    { email: 'admin@ona.com', password: 'admin123456' },
    { email: 'admin@ona.com', password: 'password123' },
    { email: 'admin@ona.com', password: 'admin123' }
  ];
  
  for (const { email, password } of credentials) {
    console.log(`\n🔑 Testing: ${email} / ${password}`);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.log(`❌ ${error.message}`);
      } else {
        console.log(`✅ Success! User ID: ${data.user.id}`);
        
        // Test session
        const { data: sessionData } = await supabase.auth.getSession();
        console.log(`📝 Session valid: ${!!sessionData.session}`);
        
        // Sign out to test next credentials
        await supabase.auth.signOut();
        break;
      }
    } catch (error) {
      console.log(`❌ Exception: ${error.message}`);
    }
  }
}

debugAuth().catch(console.error);