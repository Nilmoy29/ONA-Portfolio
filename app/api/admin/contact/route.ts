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
    const read = searchParams.get('read')
    
    let query = supabaseAdmin
      .from('contact_submissions')
      .select('*', { count: 'exact' })
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,message.ilike.%${search}%`)
    }
    
    if (read !== null && read !== '') {
      query = query.eq('is_read', read === 'true')
    }
    
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('created_at', { ascending: false })
    
    const { data, error, count } = await query
    
    if (error) {
      return NextResponse.json({ 
        error: error.message || 'Failed to fetch contact submissions' 
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
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch contact submissions' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ 
        error: 'Name, email, and message are required' 
      }, { status: 400 })
    }
    
    const { data: result, error } = await supabaseAdmin
      .from('contact_submissions')
      .insert(data)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ 
        error: error.message || 'Failed to create contact submission' 
      }, { status: 500 })
    }
    
    return NextResponse.json({ data: result }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || 'Failed to create contact submission' 
    }, { status: 500 })
  }
}