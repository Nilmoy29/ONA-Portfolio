import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const SELECT_PROJECT = `
  *,
  category:categories(id, name, slug, color),
  partners:project_partners(
    partner:partners(id, name, slug, logo_url, website_url)
  ),
  team:project_team_members(
    team_member:team_members(id, name, slug, position, profile_image_url)
  )
`

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: rawSlug } = await params
    if (!rawSlug || typeof rawSlug !== 'string') {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }
    const slug = decodeURIComponent(rawSlug.trim())

    // 1) Exact slug + published
    let result = await supabaseAdmin
      .from('projects')
      .select(SELECT_PROJECT)
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle()

    if (result.error) {
      // PGRST116 = no rows; other errors might be schema (e.g. relation name)
      const isNoRows = result.error.code === 'PGRST116'
      if (isNoRows) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }
      // Fallback: fetch project without relations so the page still loads
      console.warn('Project query with relations failed, trying minimal select:', result.error.message)
      const fallback = await supabaseAdmin
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle()
      if (fallback.data) {
        const project = { ...fallback.data, category: null, partners: [], team: [] }
        return NextResponse.json({ data: project })
      }
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // 2) No row: try case-insensitive slug match
    if (!result.data) {
      const { data: bySlug } = await supabaseAdmin
        .from('projects')
        .select(SELECT_PROJECT)
        .ilike('slug', slug)
        .eq('is_published', true)
        .limit(1)
      if (bySlug?.length) {
        result = { data: bySlug[0], error: null }
      }
    }

    // 3) Still none: check if project exists but is unpublished
    if (!result.data) {
      const { data: unpublished } = await supabaseAdmin
        .from('projects')
        .select('id, title, slug, is_published')
        .eq('slug', slug)
        .maybeSingle()
      if (unpublished) {
        return NextResponse.json(
          {
            error: 'Project not found',
            unpublished: true,
            hint: 'This project exists but is not published. Publish it in the admin to view it here.'
          },
          { status: 404 }
        )
      }
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ data: result.data })
  } catch (error) {
    console.error('Error in project GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
