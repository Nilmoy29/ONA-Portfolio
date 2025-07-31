import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('job_openings')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching job opening:', error)
      return NextResponse.json({ 
        error: 'Job opening not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ data })

  } catch (error: any) {
    console.error('Error in job opening GET:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Prepare data for update
    const updateData = {
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
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from('job_openings')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating job opening:', error)
      return NextResponse.json({ 
        error: 'Failed to update job opening' 
      }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ 
        error: 'Job opening not found' 
      }, { status: 404 })
    }

    return NextResponse.json({
      data,
      message: 'Job opening updated successfully'
    })

  } catch (error: any) {
    console.error('Error in job opening PUT:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('job_openings')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting job opening:', error)
      return NextResponse.json({ 
        error: 'Failed to delete job opening' 
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Job opening deleted successfully'
    })

  } catch (error: any) {
    console.error('Error in job opening DELETE:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
} 