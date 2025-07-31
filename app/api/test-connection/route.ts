import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Fallback configuration (same as logs route)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oscicdyjpnnykyqpvuys.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY2ljZHlqcG5ueWt5cXB2dXlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM2MTc5NywiZXhwIjoyMDY3OTM3Nzk3fQ.RFGdVve9Gq9I19YKsDSBmKIFSEJDi0141l5JkbkFQgI'

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Supabase connection...')
    
    // Environment check
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing (using fallback)',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing (using fallback)',
      NODE_ENV: process.env.NODE_ENV || 'undefined'
    }
    
    console.log('📋 Environment variables:', envCheck)
    
    // Test basic connection
    const { data: healthCheck, error: healthError } = await supabaseAdmin
      .from('projects')
      .select('count(*)')
      .limit(1)
    
    if (healthError) {
      console.error('❌ Health check failed:', healthError)
      return NextResponse.json({
        status: 'error',
        error: 'Database connection failed',
        details: healthError,
        environment: envCheck
      }, { status: 500 })
    }
    
    // Test projects table structure
    const { data: projects, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('id, title, slug')
      .limit(3)
    
    if (projectError) {
      console.error('❌ Projects query failed:', projectError)
      return NextResponse.json({
        status: 'warning',
        message: 'Basic connection works but projects query failed',
        error: projectError,
        environment: envCheck
      }, { status: 200 })
    }
    
    console.log('✅ Connection test successful')
    
    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection is working',
      environment: envCheck,
      projectCount: projects?.length || 0,
      sampleProjects: projects?.map(p => ({ id: p.id, title: p.title })) || []
    })
    
  } catch (error: any) {
    console.error('❌ Connection test failed:', error)
    
    return NextResponse.json({
      status: 'error',
      error: 'Critical connection error',
      message: error.message,
      type: error.constructor.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const testData = {
      title: 'Test Project',
      slug: 'test-project-' + Date.now(),
      description: 'This is a test project for debugging',
      is_published: false,
      sort_order: 999
    }
    
    console.log('🧪 Testing project creation with data:', testData)
    
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .insert(testData)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Test creation failed:', error)
      return NextResponse.json({
        status: 'error',
        error: 'Failed to create test project',
        details: error
      }, { status: 500 })
    }
    
    // Clean up - delete the test project
    await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', project.id)
    
    console.log('✅ Test project creation/deletion successful')
    
    return NextResponse.json({
      status: 'success',
      message: 'Project creation test passed',
      testProject: project
    })
    
  } catch (error: any) {
    console.error('❌ Creation test failed:', error)
    
    return NextResponse.json({
      status: 'error',
      error: 'Test creation failed',
      message: error.message,
      type: error.constructor.name
    }, { status: 500 })
  }
} 