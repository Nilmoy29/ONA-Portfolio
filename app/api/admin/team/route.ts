import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const published = searchParams.get('published')
    
    let query = supabaseAdmin
      .from('team_members')
      .select('*', { count: 'exact' })
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,position.ilike.%${search}%,bio.ilike.%${search}%`)
    }
    
    if (published !== null && published !== '') {
      query = query.eq('is_published', published === 'true')
    }
    
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('sort_order', { ascending: true })
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Team Members API Error:', error)
      return NextResponse.json({ 
        error: error.message || 'Failed to fetch team members' 
      }, { status: 500 })
    }
    
    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error: any) {
    console.error('Team Members API Error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch team members' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Starting POST /api/admin/team')
    
    const data = await request.json()
    console.log('Received team data:', JSON.stringify(data, null, 2))
    
    if (!data.name || !data.slug) {
      console.log('Validation failed: missing name or slug')
      return NextResponse.json({ 
        error: 'Name and slug are required' 
      }, { status: 400 })
    }
    
    console.log('Checking for duplicate slug:', data.slug)
    
    // Check for duplicate slug
    const { data: existingMember, error: duplicateError } = await supabaseAdmin
      .from('team_members')
      .select('id')
      .eq('slug', data.slug)
      .single()
    
    if (duplicateError && duplicateError.code !== 'PGRST116') {
      console.error('Error checking duplicate slug:', duplicateError)
      return NextResponse.json({ 
        error: 'Database error while checking slug uniqueness' 
      }, { status: 500 })
    }
    
    if (existingMember) {
      console.log('Duplicate slug found:', existingMember.id)
      return NextResponse.json({ 
        error: 'A team member with this slug already exists' 
      }, { status: 409 })
    }
    
    console.log('Inserting team member into database')

    const { data: result, error } = await supabaseAdmin
      .from('team_members')
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error('Team member creation error:', error)
      return NextResponse.json({ 
        error: error.message || 'Failed to create team member' 
      }, { status: 500 })
    }
    
    console.log('Team member created successfully:', result.id)

    return NextResponse.json({ data: result }, { status: 201 })
  } catch (error: any) {
    console.error('Team Members API Error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create team member' 
    }, { status: 500 })
  }
}