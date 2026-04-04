import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Fallback configuration (same as logs route) - NO DATABASE TYPES IMPORT
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oscicdyjpnnykyqpvuys.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY2ljZHlqcG5ueWt5cXB2dXlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM2MTc5NywiZXhwIjoyMDY3OTM3Nzk3fQ.RFGdVve9Gq9I19YKsDSBmKIFSEJDi0141l5JkbkFQgI'

// Create service role client WITHOUT types
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing simple projects route...')
    
    const { data: projects, error } = await supabaseAdmin
      .from('projects')
      .select('id, title, slug')
      .limit(5)
    
    if (error) {
      console.error('❌ Query error:', error)
      return NextResponse.json({
        error: error.message,
        details: error
      }, { status: 500 })
    }
    
    console.log('✅ Projects query successful')
    
    return NextResponse.json({
      status: 'success',
      data: projects
    })
    
  } catch (error: any) {
    console.error('❌ Simple projects error:', error)
    
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing simple project creation...')
    
    const body = await request.json()
    console.log('📥 Received data:', body)
    
    // Basic validation
    if (!body.title || !body.slug) {
      return NextResponse.json({
        error: 'Title and slug are required'
      }, { status: 400 })
    }
    
    // Check for duplicate slug
    const { data: existingProject, error: duplicateError } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('slug', body.slug)
      .single()
    
    if (duplicateError && duplicateError.code !== 'PGRST116') {
      console.error('❌ Error checking duplicate:', duplicateError)
      return NextResponse.json({
        error: 'Database error while checking slug',
        details: duplicateError.message
      }, { status: 500 })
    }
    
    if (existingProject) {
      return NextResponse.json({
        error: 'A project with this slug already exists'
      }, { status: 409 })
    }
    
    // Insert project
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .insert({
        title: body.title,
        slug: body.slug,
        description: body.description || 'Test project',
        is_published: body.is_published || false,
        sort_order: body.sort_order || 0
      })
      .select()
      .single()
    
    if (error) {
      console.error('❌ Creation error:', error)
      return NextResponse.json({
        error: error.message,
        details: error
      }, { status: 500 })
    }
    
    console.log('✅ Project created successfully')
    
    return NextResponse.json({
      status: 'success',
      data: project
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('❌ Simple creation error:', error)
    
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
} 