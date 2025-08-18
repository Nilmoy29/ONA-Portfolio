import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Fallback configuration (same as logs route)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oscicdyjpnnykyqpvuys.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY2ljZHlqcG5ueWt5cXB2dXlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM2MTc5NywiZXhwIjoyMDY3OTM3Nzk3fQ.RFGdVve9Gq9I19YKsDSBmKIFSEJDi0141l5JkbkFQgI'

// Create service role client that bypasses RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const published = searchParams.get('published')
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    
    // Build query with service role client (bypasses RLS)
    let query = supabaseAdmin
      .from('projects')
      .select(
        `id, title, slug, project_status, client_name, is_published, updated_at, sort_order, category_id,
         categories ( id, name, color )`,
        { count: 'exact' }
      )
    
    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,client_name.ilike.%${search}%`)
    }
    // Apply category filter
    if (category && category !== 'all') {
      query = query.eq('category_id', category)
    }
    // Apply status filter
    if (status && status !== 'all') {
      query = query.eq('project_status', status)
    }
    
    // Apply published filter
    if (published !== null && published !== '') {
      query = query.eq('is_published', published === 'true')
    }
    
    // Apply pagination and sorting
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('sort_order', { ascending: true })
    
    let { data, error, count } = await query

    // If primary query failed, return details in development and attempt a fallback without join
    if (error) {
      console.warn('Projects API primary query failed, retrying without category join:', {
        message: error.message,
        details: (error as any).details,
        hint: (error as any).hint,
        code: (error as any).code,
      })
      let simple = supabaseAdmin
        .from('projects')
        .select('id, title, slug, project_status, client_name, is_published, updated_at, sort_order, category_id', { count: 'exact' })
      if (search) simple = simple.or(`title.ilike.%${search}%,description.ilike.%${search}%,client_name.ilike.%${search}%`)
      if (category && category !== 'all') simple = simple.eq('category_id', category)
      if (status && status !== 'all') simple = simple.eq('project_status', status)
      const from = (page - 1) * limit
      const to = from + limit - 1
      simple = simple.range(from, to).order('sort_order', { ascending: true })
      const retry = await simple
      // Use any type for fallback data since it has a different structure
      data = retry.data as any
      error = retry.error as any
      count = retry.count
      if (error) {
        console.error('Projects API Fallback Error:', {
          message: error.message,
          details: (error as any).details,
          hint: (error as any).hint,
          code: (error as any).code,
        })
        return NextResponse.json({ 
          error: error.message || 'Failed to fetch projects',
          details: (error as any).details,
          hint: (error as any).hint,
          code: (error as any).code,
        }, { status: 500 })
      }
    }
    
    // Transform data to include categories if they exist, or null if not
    const transformedData = data?.map((item: any) => ({
      ...item,
      categories: item.categories || null
    })) || []
    
    return NextResponse.json({
      data: transformedData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error: any) {
    console.error('Projects API Error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch projects',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 POST /api/admin/projects - Starting request')
    console.log('🔍 Request method:', request.method)
    console.log('🔍 Request URL:', request.url)
    console.log('🔍 Request headers:', Object.fromEntries(request.headers.entries()))
    console.log('📋 Environment check:')
    console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing')
    console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing')
    
    const data = await request.json()
    console.log('📥 Received data keys:', Object.keys(data))
    console.log('📥 Received data:', JSON.stringify(data, null, 2))
    
    // Validate required fields
    if (!data.title || !data.slug) {
      console.log('❌ Validation failed: missing title or slug')
      return NextResponse.json({ 
        error: 'Title and slug are required' 
      }, { status: 400 })
    }
    
    console.log('✅ Basic validation passed')
    console.log('🔍 Checking for duplicate slug:', data.slug)
    
    // Test Supabase connection first (use a valid lightweight head/count query)
    try {
      const { error: testError } = await supabaseAdmin
        .from('projects')
        .select('*', { count: 'exact', head: true })
      
      if (testError) {
        console.error('❌ Supabase connection test failed:', testError)
        return NextResponse.json({ 
          error: 'Database connection failed',
          details: testError.message 
        }, { status: 500 })
      }
      
      console.log('✅ Supabase connection test passed')
    } catch (connError) {
      console.error('❌ Supabase connection error:', connError)
      return NextResponse.json({ 
        error: 'Database connection error',
        details: connError instanceof Error ? connError.message : 'Unknown error'
      }, { status: 500 })
    }
    
    // Check for duplicate slug
    const { data: existingProject, error: duplicateError } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('slug', data.slug)
      .single()
    
    if (duplicateError && duplicateError.code !== 'PGRST116') {
      console.error('❌ Error checking duplicate slug:', duplicateError)
      return NextResponse.json({ 
        error: 'Database error while checking slug uniqueness',
        details: duplicateError.message 
      }, { status: 500 })
    }
    
    if (existingProject) {
      console.log('❌ Duplicate slug found:', existingProject.id)
      return NextResponse.json({ 
        error: 'A project with this slug already exists' 
      }, { status: 409 })
    }
    
    console.log('✅ Slug is unique, proceeding with insertion')
    
    // Extract team member IDs before inserting project
    const teamMemberIds = data.team_member_ids || []

    // Whitelist allowed fields to avoid DB errors from unknown columns
    const allowedFields = [
      'title', 'slug', 'description', 'content', 'category_id', 'featured_image_url',
      'gallery_images', 'features', 'client_name', 'location', 'project_status',
      'is_published', 'sort_order', 'project_type', 'completion_date',
      'architecture_consultant', 'engineering_consultant'
    ] as const

    const projectData: Record<string, any> = {}
    allowedFields.forEach((key) => {
      if (data[key] !== undefined) projectData[key] = data[key]
    })
    
    console.log('📤 Project data to insert:', JSON.stringify(projectData, null, 2))
    
    // Insert project
    let insertResult = await supabaseAdmin
      .from('projects')
      .insert(projectData)
      .select()
      .single()
    let project = insertResult.data
    let error = insertResult.error as any

    // If DB doesn't yet have the new consultant columns, retry without them
    if (error && typeof error.message === 'string' && (
      error.message.includes('architecture_consultant') ||
      error.message.includes('engineering_consultant')
    )) {
      console.warn('⚠️ Consultant columns missing. Retrying insert without them.')
      const retryData = { ...projectData }
      delete retryData.architecture_consultant
      delete retryData.engineering_consultant
      const retry = await supabaseAdmin
        .from('projects')
        .insert(retryData)
        .select()
        .single()
      project = retry.data
      error = retry.error
    }
    
    if (error) {
      console.error('❌ Project creation error:', error)
      console.error('❌ Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      const errorResponse = {
        error: error.message || 'Failed to create project',
        details: error.details || null,
        hint: error.hint || null,
        code: error.code || null,
        status: 500,
        timestamp: new Date().toISOString()
      }
      
      console.log('📤 Sending database error response:', JSON.stringify(errorResponse, null, 2))
      
      return NextResponse.json(errorResponse, { status: 500 })
    }
    
    console.log('✅ Project created successfully:', project.id)
    
    // Create team member relationships if any team members were selected
    if (teamMemberIds.length > 0) {
      console.log('👥 Creating team member relationships for:', teamMemberIds)
      
      const teamMemberRelations = teamMemberIds.map((teamMemberId: string) => ({
        project_id: project.id,
        team_member_id: teamMemberId
      }))
      
      const { error: teamError } = await supabaseAdmin
        .from('project_team_members')
        .insert(teamMemberRelations)
      
      if (teamError) {
        console.error('❌ Error creating team member relationships:', teamError)
        // Don't fail the entire request, just log the error
      } else {
        console.log('✅ Team member relationships created successfully')
      }
    }
    
    console.log('🎉 Request completed successfully')
    return NextResponse.json({ data: project }, { status: 201 })
    
  } catch (error: any) {
    console.error('❌ Critical error in POST /api/admin/projects:', error)
    console.error('❌ Error stack:', error.stack)
    console.error('❌ Error type:', error.constructor.name)
    console.error('❌ Error message:', error.message)
    
    // Ensure we always return a valid JSON response
    const errorResponse: {
      error: string;
      type: string;
      status: number;
      timestamp: string;
      stack?: string;
    } = {
      error: error.message || 'Failed to create project',
      type: error.constructor.name,
      status: 500,
      timestamp: new Date().toISOString()
    }
    
    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = error.stack
    }
    
    console.log('📤 Sending error response:', JSON.stringify(errorResponse, null, 2))
    
    return NextResponse.json(errorResponse, { status: 500 })
  }
}