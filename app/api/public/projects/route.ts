import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Check if environment variables are available, fallback gracefully
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
}

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceKey)
  : null

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        error: 'Service temporarily unavailable - missing configuration' 
      }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''
    const sort = searchParams.get('sort') || 'newest'
    const featured = searchParams.get('featured') === 'true'
    
    let query = supabase
      .from('projects')
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          color
        )
      `, { count: 'exact' })
      .eq('is_published', true)
    
    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,client_name.ilike.%${search}%`)
    }
    
    // Apply category filter
    if (category && category !== 'all') {
      query = query.eq('category_id', category)
    }
    
    // Apply featured filter
    if (featured) {
      query = query.eq('is_featured', true)
    }

    // Apply sorting
    switch (sort) {
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'alphabetical':
        query = query.order('title', { ascending: true })
        break
      case 'custom':
        query = query.order('sort_order', { ascending: true })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }
    
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Error fetching projects:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return NextResponse.json({ 
        error: `Database error: ${error.message}`,
        code: error.code
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
    console.error('Error in projects GET:', {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      error: error
    })
    return NextResponse.json({ 
      error: `Server error: ${error?.message || 'Unknown error'}` 
    }, { status: 500 })
  }
}