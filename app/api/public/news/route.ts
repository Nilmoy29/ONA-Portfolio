import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''
    
    let query = supabase
      .from('explore_content')
      .select(`
        *,
        author:team_members(id, name, position, profile_image_url)
      `, { count: 'exact' })
      .eq('is_published', true)
      .eq('content_type', 'article')
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`)
    }
    
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('created_at', { ascending: false })
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Error fetching news articles:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch news articles' 
      }, { status: 500 })
    }
    
    // Transform data to match news article format
    const articles = (data || []).map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || '',
      content: article.content || '',
      featured_image_url: article.featured_image_url,
      author: article.author?.name || 'ONA Team',
      author_image: article.author?.profile_image_url,
      published_date: article.created_at,
      category: 'Design Philosophy', // Default category for now
      read_time: Math.ceil((article.content?.length || 0) / 200) // Estimate reading time
    }))
    
    return NextResponse.json({
      data: articles,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error: any) {
    console.error('Error in news GET:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch news articles' 
    }, { status: 500 })
  }
} 