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
    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        category:categories(name, slug, color),
        partners:project_partners(
          partner:partners(name, slug, logo_url, website_url)
        ),
        team:project_team_members(
          team_member:team_members(name, slug, position, profile_image_url)
        )
      `)
      .eq('slug', params.slug)
      .eq('is_published', true)
      .single()

    if (error) {
      console.error('Error fetching project:', error)
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ data: project })

  } catch (error) {
    console.error('Error in project GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}