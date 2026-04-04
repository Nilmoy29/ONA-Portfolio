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
    const content_type = searchParams.get('content_type') || ''
    
    let query = supabaseAdmin
      .from('explore_content')
      .select(`
        *,
        categories(id, name, slug, color),
        explore_types(id, name, slug, icon)
      `, { count: 'exact' })
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,content.ilike.%${search}%,author.ilike.%${search}%`)
    }
    
    if (published !== null && published !== '') {
      query = query.eq('is_published', published === 'true')
    }
    
    if (content_type) {
      query = query.eq('content_type', content_type)
    }
    
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('sort_order', { ascending: true })
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Explore Content API Error:', error)
      return NextResponse.json({ 
        error: error.message || 'Failed to fetch explore content' 
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
    console.error('Explore Content API Error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch explore content' 
    }, { status: 500 })
  }
}

// Helper function to validate author_id before database operations
async function validateAuthorId(authorId: string | null | undefined) {
  if (authorId === null || authorId === undefined) {
    return { valid: true, message: 'Author ID is optional' }
  }
  
  // Check if author_id exists in team_members table
  const { data: teamMember, error } = await supabaseAdmin
    .from('team_members')
    .select('id, is_published')
    .eq('id', authorId)
    .single()
  
  if (error || !teamMember) {
    return { 
      valid: false, 
      message: `Invalid author_id: ${authorId}. Team member not found.` 
    }
  }
  
  if (!teamMember.is_published) {
    return { 
      valid: false, 
      message: `Author ID ${authorId} references an unpublished team member.` 
    }
  }
  
  return { valid: true, message: 'Author ID is valid' }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.title || !data.slug) {
      return NextResponse.json({ 
        error: 'Title and slug are required' 
      }, { status: 400 })
    }
    
    // Validate author_id if provided
    if (data.author_id) {
      const validation = await validateAuthorId(data.author_id)
      if (!validation.valid) {
        return NextResponse.json({ error: validation.message }, { status: 400 })
      }
    }
    
    // Check for duplicate slug
    const { data: existingContent } = await supabaseAdmin
      .from('explore_content')
      .select('id')
      .eq('slug', data.slug)
      .single()
    
    if (existingContent) {
      return NextResponse.json({ 
        error: 'Content with this slug already exists' 
      }, { status: 409 })
    }
    
    const { data: result, error } = await supabaseAdmin
      .from('explore_content')
      .insert(data)
      .select()
      .single()
    
    if (error) {
      console.error('Explore content creation error:', error)
      return NextResponse.json({ 
        error: error.message || 'Failed to create explore content' 
      }, { status: 500 })
    }
    
    return NextResponse.json({ data: result }, { status: 201 })
  } catch (error: any) {
    console.error('Explore Content API Error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create explore content' 
    }, { status: 500 })
  }
}