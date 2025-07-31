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
    const search = searchParams.get('search') || ''
    
    let query = supabase
      .from('team_members')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,position.ilike.%${search}%,bio.ilike.%${search}%`)
    }
    
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('sort_order', { ascending: true })
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Error fetching team members:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch team members' 
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
    console.error('Error in team GET:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch team members' 
    }, { status: 500 })
  }
}