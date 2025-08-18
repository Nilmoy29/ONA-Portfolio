import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'

// Using server-only admin client; env is validated in its module

export async function GET(request: NextRequest) {
  try {
    // supabase client is available via server-only import

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20') // Reduced limit
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''
    const sort = searchParams.get('sort') || 'newest'
    const featured = searchParams.get('featured') === 'true'
    
    // Ultra-simplified query to prevent timeouts
    let query = supabase
      .from('projects')
      .select(`
        id,
        title,
        slug,
        description,
        featured_image_url,
        client_name,
        location,
        project_status,
        created_at
      `, { count: 'exact' })
      .eq('is_published', true)
      
    
    // Apply search filter (simplified)
    if (search) {
      query = query.ilike('title', `%${search}%`)
    }
    
    // Apply category filter
    if (category && category !== 'all') {
      query = query.eq('category_id', category)
    }
    
    // Apply featured filter
    if (featured) {
      query = query.eq('is_featured', true)
    }

    // Apply sorting (simplified)
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
        // Sort by explicit sort_order first, then fallback to newest
        query = query
          .order('sort_order', { ascending: true, nullsFirst: false as any })
          .order('created_at', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }
    
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Query timeout')), 8000) // 8 second timeout
    })
    
    const queryPromise = query
    
    const { data, error, count } = await Promise.race([
      queryPromise,
      timeoutPromise
    ]) as any
    
    if (error) {
      console.error('Error fetching projects:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      // Handle timeout specifically
      if (error.code === '57014' || error.message?.includes('timeout')) {
        return NextResponse.json({ 
          error: 'Database query timed out - please try again',
          code: error.code
        }, { status: 408 })
      }
      
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
    
    // Handle timeout errors
    if (error?.message?.includes('timeout')) {
      return NextResponse.json({ 
        error: 'Request timeout - please try again' 
      }, { status: 408 })
    }
    
    return NextResponse.json({ 
      error: `Server error: ${error?.message || 'Unknown error'}` 
    }, { status: 500 })
  }
}