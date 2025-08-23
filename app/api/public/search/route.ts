import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all' // all, projects, team, services, explore, partners
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')

    if (!query.trim()) {
      return NextResponse.json({
        data: {
          projects: [],
          team: [],
          services: [],
          explore: [],
          partners: [],
          total: 0
        },
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      })
    }

    const searchQuery = query.trim()
    const tsQuery = searchQuery.split(' ').join(' & ')
    
    const results: any = {
      projects: [],
      team: [],
      services: [],
      explore: [],
      partners: []
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit
    
    // Search projects
    if (type === 'all' || type === 'projects') {
      const { data: projects } = await supabase
        .from('projects')
        .select('id, title, slug, description, location, client, featured_image_url, is_featured')
        .eq('is_published', true)
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,client.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .range(type === 'projects' ? offset : 0, type === 'projects' ? offset + limit - 1 : 4)

      results.projects = (projects || []).map(project => ({
        ...project,
        type: 'project',
        url: `/projects/${project.slug}`
      }))
    }

    // Search team members
    if (type === 'all' || type === 'team') {
      const { data: team } = await supabase
        .from('team_members')
        .select('id, name, slug, position, bio, profile_image_url')
        .eq('is_published', true)
        .or(`name.ilike.%${searchQuery}%,position.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`)
        .order('sort_order', { ascending: true })
        .range(type === 'team' ? offset : 0, type === 'team' ? offset + limit - 1 : 4)

      results.team = (team || []).map(member => ({
        ...member,
        type: 'team',
        url: `/team/${member.slug}`
      }))
    }

    // Search services
    if (type === 'all' || type === 'services') {
      const { data: services } = await supabase
        .from('services')
        .select('id, name, slug, description, service_type, featured_image_url')
        .eq('is_published', true)
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,service_type.ilike.%${searchQuery}%`)
        .order('sort_order', { ascending: true })
        .range(type === 'services' ? offset : 0, type === 'services' ? offset + limit - 1 : 4)

      results.services = (services || []).map(service => ({
        ...service,
        title: service.name,
        type: 'service',
        url: `/services/${service.slug}`
      }))
    }

    // Search explore content
    if (type === 'all' || type === 'explore') {
      const { data: explore } = await supabase
        .from('explore_content')
        .select('id, title, slug, excerpt, content_type, featured_image_url, published_at')
        .eq('is_published', true)
        .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .order('published_at', { ascending: false })
        .range(type === 'explore' ? offset : 0, type === 'explore' ? offset + limit - 1 : 4)

      results.explore = (explore || []).map(content => ({
        ...content,
        type: 'explore',
        url: `/explore/${content.slug}`
      }))
    }

    // Search partners
    if (type === 'all' || type === 'partners') {
      const { data: partners } = await supabase
        .from('partners')
        .select('id, name, slug, description, logo_url, partnership_type, location')
        .eq('is_published', true)
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,partnership_type.ilike.%${searchQuery}%`)
        .order('sort_order', { ascending: true })
        .range(type === 'partners' ? offset : 0, type === 'partners' ? offset + limit - 1 : 4)

      results.partners = (partners || []).map(partner => ({
        ...partner,
        title: partner.name,
        type: 'partner',
        url: `/partners/${partner.slug}`
      }))
    }

    // Calculate totals
    const total = results.projects.length + results.team.length + results.services.length + 
                  results.explore.length + results.partners.length
    
    // For single type searches, return just that type's results
    if (type !== 'all') {
      const typeResults = results[type] || []
      return NextResponse.json({
        data: typeResults,
        pagination: {
          page,
          limit,
          total: typeResults.length,
          totalPages: Math.ceil(typeResults.length / limit)
        }
      })
    }

    // For "all" searches, return combined results
    const allResults = [
      ...results.projects,
      ...results.team,
      ...results.services,
      ...results.explore,
      ...results.partners
    ]

    return NextResponse.json({
      data: {
        ...results,
        all: allResults,
        total
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error: any) {
    console.error('Error in search GET:', error)
    return NextResponse.json({ 
      error: 'Search failed' 
    }, { status: 500 })
  }
} 