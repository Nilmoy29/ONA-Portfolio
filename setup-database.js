const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🔧 Setting up ONA Portfolio database...\n');

  try {
    // Read the SQL file
    const sqlFile = path.join(__dirname, 'database-setup-compatible.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Split into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim());

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement) continue;

      console.log(`⏳ Executing statement ${i + 1}/${statements.length}`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error(`❌ Error in statement ${i + 1}:`, error.message);
        // Continue with other statements
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`);
      }
    }

    console.log('\n🎉 Database setup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Create an admin user in Supabase Auth');
    console.log('2. Visit http://localhost:3004/admin/login');
    console.log('3. Sign in with your admin credentials');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
}

// Alternative simple setup function
async function simpleSetup() {
  console.log('🔧 Setting up essential tables...\n');

  // Create admin_profiles table
  const { error: adminError } = await supabase
    .from('admin_profiles')
    .select('*')
    .limit(1);

  if (adminError && adminError.code === '42P01') {
    console.log('📝 Creating admin_profiles table...');
    
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_profiles (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          role TEXT NOT NULL DEFAULT 'admin',
          permissions JSONB DEFAULT '{}',
          is_active BOOLEAN DEFAULT true,
          last_login TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id)
        );
      `
    });

    if (createError) {
      console.error('❌ Failed to create admin_profiles table:', createError);
      return false;
    }
    
    console.log('✅ admin_profiles table created successfully');
  }

  // Enable RLS
  const { error: rlsError } = await supabase.rpc('exec_sql', {
    sql: 'ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;'
  });

  if (rlsError) {
    console.log('⚠️  RLS setup warning:', rlsError.message);
  }

  console.log('🎉 Essential setup completed!');
  return true;
}

// Run setup
if (require.main === module) {
  simpleSetup().catch(console.error);
}

module.exports = { setupDatabase, simpleSetup };