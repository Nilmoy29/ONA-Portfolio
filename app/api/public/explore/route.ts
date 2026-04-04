import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const content_type = searchParams.get('type') || ''
    
    let query = supabase
      .from('explore_content')
      .select(
        `
          id,
          title,
          slug,
          content_type,
          excerpt,
          description,
          featured_image_url,
          author,
          created_at
        `,
        { count: 'exact' }
      )
      .eq('is_published', true)
    
    if (content_type) {
      query = query.eq('content_type', content_type)
    }
    
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('created_at', { ascending: false })
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Error fetching explore content:', {
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
    console.error('Error in explore GET:', error)
    // Graceful degrade on unexpected errors
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    return NextResponse.json({ 
      data: [],
      pagination: { page, limit, total: 0, totalPages: 0 }
    })
  }
}