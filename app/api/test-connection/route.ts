import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        error: 'Missing Supabase configuration',
        status: 'error'
      }, { status: 503 })
    }

    // Simple test query
    const { data, error } = await supabase
      .from('projects')
      .select('id, title')
      .eq('is_published', true)
      .limit(1)

    if (error) {
      return NextResponse.json({ 
        error: error.message,
        code: error.code,
        details: error.details,
        status: 'error'
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Database connection working',
      data: data,
      count: data?.length || 0
    })

  } catch (error: any) {
    return NextResponse.json({ 
      error: error?.message || 'Unknown error',
      status: 'error'
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