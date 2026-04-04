import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Supabase imports step by step...')
    
    // Step 1: Test import
    console.log('Step 1: Testing Supabase import...')
    const { createClient } = await import('@supabase/supabase-js')
    console.log('✅ Supabase import successful')
    
    // Step 2: Check environment variables
    console.log('Step 2: Checking environment variables...')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oscicdyjpnnykyqpvuys.supabase.co'
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY2ljZHlqcG5ueWt5cXB2dXlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM2MTc5NywiZXhwIjoyMDY3OTM3Nzk3fQ.RFGdVve9Gq9I19YKsDSBmKIFSEJDi0141l5JkbkFQgI'
    
    console.log('✅ Environment variables loaded')
    console.log('URL length:', supabaseUrl.length)
    console.log('Key length:', supabaseServiceKey.length)
    
    // Step 3: Test client creation
    console.log('Step 3: Creating Supabase client...')
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    console.log('✅ Supabase client created')
    
    // Step 4: Test simple query
    console.log('Step 4: Testing simple query...')
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('count(*)')
      .limit(1)
    
    if (error) {
      console.error('❌ Query error:', error)
      return NextResponse.json({
        status: 'error',
        step: 'query',
        error: error.message,
        details: error
      }, { status: 500 })
    }
    
    console.log('✅ Query successful')
    
    return NextResponse.json({
      status: 'success',
      message: 'All Supabase tests passed',
      steps: [
        'Import successful',
        'Environment variables loaded', 
        'Client created',
        'Query executed'
      ],
      queryResult: data
    })
    
  } catch (error: any) {
    console.error('❌ Supabase test error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: error.stack,
      name: error.name
    }, { status: 500 })
  }
} 