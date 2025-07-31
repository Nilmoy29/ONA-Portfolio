const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oscicdyjpnnykyqpvuys.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY2ljZHlqcG5ueWt5cXB2dXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NDk3MjYsImV4cCI6MjA1MjQyNTcyNn0.5EJJhTXPCWMdZCOWYCwlWOjYQJJTnbUJJqQRYPkRQg8'
)

async function testDatabase() {
  console.log('🔍 Testing database connection...')
  
  try {
    // Test basic connection
    const { data: tables, error: tablesError } = await supabase
      .from('admin_profiles')
      .select('*')
      .limit(1)
    
    if (tablesError) {
      console.log('❌ Admin profiles table error:', tablesError.message)
      
      // Try to test if any table exists
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .limit(1)
      
      if (projectsError) {
        console.log('❌ Projects table error:', projectsError.message)
      } else {
        console.log('✅ Projects table exists')
      }
    } else {
      console.log('✅ Admin profiles table exists')
      console.log('Found profiles:', tables?.length || 0)
    }
    
    // Test auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) {
      console.log('❌ Auth error:', authError.message)
    } else {
      console.log('✅ Auth working, user:', user?.email || 'No user')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testDatabase() 