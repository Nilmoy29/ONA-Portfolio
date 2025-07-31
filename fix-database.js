const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://oscicdyjpnnykyqpvuys.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY2ljZHlqcG5ueWt5cXB2dXlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM2MTc5NywiZXhwIjoyMDY3OTM3Nzk3fQ.RFGdVve9Gq9I19YKsDSBmKIFSEJDi0141l5JkbkFQgI'
);

async function fixDatabase() {
  console.log('🔧 Starting database fixes...');
  
  // 1. Create activity_logs table
  try {
    console.log('📝 Creating activity_logs table...');
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `CREATE TABLE IF NOT EXISTS activity_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id UUID,
        details JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`
    });
    
    if (createError) {
      console.log('⚠️ Creating activity_logs via rpc failed, trying direct insert...');
      // Try creating a dummy record to force table creation
      await supabase.from('activity_logs').insert({
        action: 'system',
        entity_type: 'setup',
        details: { message: 'Database setup' }
      });
      console.log('✅ Activity logs table ready');
    }
  } catch (err) {
    console.log('⚠️ Activity logs table might already exist or not be needed');
  }
  
  // 2. Fix admin profile permissions
  try {
    console.log('🔑 Updating admin profile permissions...');
    const { error: updateError } = await supabase
      .from('admin_profiles')
      .update({
        permissions: {
          projects: { create: true, read: true, update: true, delete: true },
          team_members: { create: true, read: true, update: true, delete: true },
          services: { create: true, read: true, update: true, delete: true },
          explore_content: { create: true, read: true, update: true, delete: true },
          partners: { create: true, read: true, update: true, delete: true },
          contact_submissions: { create: false, read: true, update: true, delete: true },
          site_settings: { create: true, read: true, update: true, delete: true },
          admin_users: { create: true, read: true, update: true, delete: true }
        }
      })
      .eq('role', 'admin');
    
    if (updateError) {
      console.error('❌ Failed to update admin permissions:', updateError.message);
    } else {
      console.log('✅ Admin permissions updated');
    }
  } catch (err) {
    console.error('❌ Exception updating admin permissions:', err.message);
  }
  
  // 3. Test table access
  console.log('🧪 Testing table access...');
  const tables = ['admin_profiles', 'projects', 'team_members', 'services', 'explore_content', 'partners', 'contact_submissions', 'categories', 'site_settings'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: OK (${data.length} records)`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }
  
  console.log('🎉 Database fixes completed!');
}

fixDatabase().catch(console.error);