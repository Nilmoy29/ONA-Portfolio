import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { data: jobOpening, error } = await supabase
      .from('job_openings')
      .select('*')
      .eq('slug', params.slug)
      .eq('is_published', true)
      .single()

    if (error) {
      console.error('Error fetching job opening:', error)
      return NextResponse.json({ error: 'Job opening not found' }, { status: 404 })
    }

    return NextResponse.json({ data: jobOpening })

  } catch (error) {
    console.error('Error in job opening GET:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
} 