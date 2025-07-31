import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const department = searchParams.get('department') || ''
    const status = searchParams.get('status') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let query = supabaseAdmin
      .from('job_openings')
      .select('*', { count: 'exact' })

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,department.ilike.%${search}%,location.ilike.%${search}%`)
    }
    
    if (department) {
      query = query.eq('department', department)
    }
    
    if (status === 'published') {
      query = query.eq('is_published', true)
    } else if (status === 'draft') {
      query = query.eq('is_published', false)
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    
    query = query
      .range(from, to)
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation
    if (!body.title?.trim()) {
      return NextResponse.json({ 
        error: 'Title is required' 
      }, { status: 400 })
    }
    
    if (!body.department?.trim()) {
      return NextResponse.json({ 
        error: 'Department is required' 
      }, { status: 400 })
    }

    // Prepare data for insertion
    const jobData = {
      title: body.title.trim(),
      department: body.department.trim(),
      location: body.location?.trim() || null,
      employment_type: body.employment_type || null,
      experience_level: body.experience_level || null,
      salary_range: body.salary_range?.trim() || null,
      description: body.description?.trim() || null,
      requirements: body.requirements || [],
      responsibilities: body.responsibilities || [],
      benefits: body.benefits || [],
      application_deadline: body.application_deadline || null,
      application_email: body.application_email?.trim() || null,
      application_url: body.application_url?.trim() || null,
      is_published: body.is_published || false,
      is_featured: body.is_featured || false,
      sort_order: body.sort_order || 0,
      seo_title: body.seo_title?.trim() || null,
      seo_description: body.seo_description?.trim() || null,
    }

    const { data, error } = await supabaseAdmin
      .from('job_openings')
      .insert([jobData])
      .select()
      .single()

    if (error) {
      console.error('Error creating job opening:', error)
      return NextResponse.json({ 
        error: 'Failed to create job opening' 
      }, { status: 500 })
    }

    return NextResponse.json({
      data,
      message: 'Job opening created successfully'
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error in careers POST:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
} 