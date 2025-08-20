import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'

// Using server-only admin client; env is validated in its module

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''
    const sort = searchParams.get('sort') || 'newest'
    const featured = searchParams.get('featured') === 'true'
    
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
      
    if (search) query = query.ilike('title', `%${search}%`)
    if (category && category !== 'all') query = query.eq('category_id', category)
    if (featured) query = query.eq('is_featured', true)

    switch (sort) {
      case 'oldest': query = query.order('created_at', { ascending: true }); break
      case 'alphabetical': query = query.order('title', { ascending: true }); break
      case 'custom':
        query = query.order('sort_order', { ascending: true, nullsFirst: false as any })
                     .order('created_at', { ascending: false })
        break
      default: query = query.order('created_at', { ascending: false })
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
      // Graceful degrade
      return NextResponse.json({
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 }
      })
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
    // Graceful degrade on unexpected errors
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    return NextResponse.json({ 
      data: [],
      pagination: { page, limit, total: 0, totalPages: 0 }
    })
  }
}