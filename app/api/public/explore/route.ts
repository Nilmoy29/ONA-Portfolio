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
    const content_type = searchParams.get('type') || ''
    
    let query = supabase
      .from('explore_content')
      .select(`*`, { count: 'exact' })
      .eq('is_published', true)
    
    if (content_type) {
      query = query.eq('content_type', content_type)
    }
    
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('created_at', { ascending: false })
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Error fetching explore content:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch explore content' 
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
    console.error('Error in explore GET:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch explore content' 
    }, { status: 500 })
  }
}