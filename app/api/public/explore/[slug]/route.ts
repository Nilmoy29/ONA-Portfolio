import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable - missing configuration' },
        { status: 503 }
      )
    }
    const { data: content, error } = await supabase
      .from('explore_content')
      .select(
        `
          id,
          title,
          slug,
          subtitle,
          description,
          content,
          content_type,
          excerpt,
          featured_image_url,
          gallery_images,
          video_url,
          tags,
          author,
          external_link,
          publication_date,
          created_at,
          updated_at
        `
      )
      .eq('slug', params.slug)
      .eq('is_published', true)
      .single()

    if (error) {
      console.error('Error fetching explore content:', error)
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    return NextResponse.json({ data: content })

  } catch (error) {
    console.error('Error in explore content GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}