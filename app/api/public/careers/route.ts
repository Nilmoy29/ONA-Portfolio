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
    const department = searchParams.get('department') || ''
    const employment_type = searchParams.get('employment_type') || ''
    const experience_level = searchParams.get('experience_level') || ''
    const featured = searchParams.get('featured') === 'true'
    
    let query = supabase
      .from('job_openings')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
    
    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,department.ilike.%${search}%,location.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    if (department) {
      query = query.eq('department', department)
    }
    
    if (employment_type) {
      query = query.eq('employment_type', employment_type)
    }
    
    if (experience_level) {
      query = query.eq('experience_level', experience_level)
    }
    
    if (featured) {
      query = query.eq('is_featured', true)
    }
    
    // Pagination and ordering
    const from = (page - 1) * limit
    const to = from + limit - 1
    
    query = query
      .range(from, to)
      .order('is_featured', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Error fetching job openings:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch job openings' 
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
    console.error('Error in careers GET:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
} 