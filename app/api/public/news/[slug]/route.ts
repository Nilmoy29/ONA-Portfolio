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
    const { data: article, error } = await supabase
      .from('explore_content')
      .select(`
        *,
        author:team_members(id, name, position, profile_image_url)
      `)
      .eq('slug', params.slug)
      .eq('is_published', true)
      .eq('content_type', 'article')
      .single()

    if (error) {
      console.error('Error fetching news article:', error)
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json({ data: article })

  } catch (error) {
    console.error('Error in news article GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 