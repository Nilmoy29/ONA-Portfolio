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
    
    let query = supabaseAdmin
      .from('categories')
      .select('*', { count: 'exact' })
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('sort_order', { ascending: true })
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Categories API Error:', error)
      return NextResponse.json({ 
        error: error.message || 'Failed to fetch categories' 
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
    console.error('Categories API Error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch categories' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.name || !data.slug) {
      return NextResponse.json({ 
        error: 'Name and slug are required' 
      }, { status: 400 })
    }
    
    // Check for duplicate slug
    const { data: existingCategory } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('slug', data.slug)
      .single()
    
    if (existingCategory) {
      return NextResponse.json({ 
        error: 'A category with this slug already exists' 
      }, { status: 409 })
    }
    
    const { data: result, error } = await supabaseAdmin
      .from('categories')
      .insert(data)
      .select()
      .single()
    
    if (error) {
      console.error('Category creation error:', error)
      return NextResponse.json({ 
        error: error.message || 'Failed to create category' 
      }, { status: 500 })
    }
    
    return NextResponse.json({ data: result }, { status: 201 })
  } catch (error: any) {
    console.error('Categories API Error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create category' 
    }, { status: 500 })
  }
}