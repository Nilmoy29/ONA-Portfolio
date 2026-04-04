import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create service role client that bypasses RLS
const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    // Get counts for all entities
    const [
      projectsResult,
      publishedProjectsResult,
      teamMembersResult,
      servicesResult,
      exploreContentResult,
      partnersResult,
      contactSubmissionsResult,
      unreadContactsResult,
      categoriesResult
    ] = await Promise.all([
      supabaseAdmin.from('projects').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('projects').select('*', { count: 'exact', head: true }).eq('is_published', true),
      supabaseAdmin.from('team_members').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('services').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('explore_content').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('partners').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('contact_submissions').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('is_read', false),
      supabaseAdmin.from('categories').select('*', { count: 'exact', head: true })
    ])

    // Check for any errors
    const errors = [
      projectsResult.error,
      publishedProjectsResult.error,
      teamMembersResult.error,
      servicesResult.error,
      exploreContentResult.error,
      partnersResult.error,
      contactSubmissionsResult.error,
      unreadContactsResult.error,
      categoriesResult.error
    ].filter(Boolean)

    if (errors.length > 0) {
      console.error('Dashboard stats errors:', errors)
      return NextResponse.json({ 
        error: 'Failed to fetch some dashboard statistics' 
      }, { status: 500 })
    }

    const stats = {
      projects: projectsResult.count || 0,
      publishedProjects: publishedProjectsResult.count || 0,
      teamMembers: teamMembersResult.count || 0,
      services: servicesResult.count || 0,
      exploreContent: exploreContentResult.count || 0,
      partners: partnersResult.count || 0,
      contactSubmissions: contactSubmissionsResult.count || 0,
      unreadContacts: unreadContactsResult.count || 0,
      categories: categoriesResult.count || 0
    }

    return NextResponse.json({ data: stats })
  } catch (error: any) {
    console.error('Dashboard stats API Error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch dashboard statistics' 
    }, { status: 500 })
  }
}