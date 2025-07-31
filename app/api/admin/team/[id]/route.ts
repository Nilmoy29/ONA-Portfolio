import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database-types'

// Create service role client for data operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)

// Helper function to verify admin access (simplified - using service role)
async function verifyAdminAccess(authHeader?: string | null) {
  // For now, we'll use service role for all admin operations
  // In production, you'd want proper JWT verification here
  return { authorized: true, session: null, adminProfile: null, error: null, status: 200 }
}

// Helper function to log activity
async function logActivity(userId: string, action: string, entityId?: string, details?: any) {
  try {
    await supabaseAdmin
      .from('admin_activity_logs')
      .insert({
        user_id: userId,
        action,
        entity_type: 'team_member',
        entity_id: entityId,
        details
      })
  } catch (error) {
    console.error('Failed to log activity:', error)
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access
    const authResult = await verifyAdminAccess()
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { data: teamMember, error } = await supabaseAdmin
      .from('team_members')
      .select(`
        *,
        project_team_members (
          id,
          role,
          projects (
            id,
            title,
            slug,
            featured_image_url
          )
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching team member:', error)
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    return NextResponse.json({ data: teamMember })

  } catch (error) {
    console.error('Error in team member GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access
    const authResult = await verifyAdminAccess()
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    // Parse request body
    const body = await request.json()
    
    // Check if team member exists
    const { data: existingMember, error: fetchError } = await supabaseAdmin
      .from('team_members')
      .select('id, slug, name')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    // Check for duplicate slug if slug is being changed
    if (body.slug && body.slug !== existingMember.slug) {
      const { data: duplicateMember } = await supabaseAdmin
        .from('team_members')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', params.id)
        .single()

      if (duplicateMember) {
        return NextResponse.json({ error: 'A team member with this slug already exists' }, { status: 409 })
      }
    }

    // Prepare update data
    const updateData = {
      ...(body.name && { name: body.name }),
      ...(body.slug && { slug: body.slug }),
      ...(body.position !== undefined && { position: body.position }),
      ...(body.bio !== undefined && { bio: body.bio }),
      ...(body.profile_image_url !== undefined && { profile_image_url: body.profile_image_url }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(body.specializations !== undefined && { specializations: body.specializations }),
      ...(body.is_published !== undefined && { is_published: body.is_published }),
      ...(body.sort_order !== undefined && { sort_order: body.sort_order }),
      updated_at: new Date().toISOString()
    }

    // Update team member
    const { data: teamMember, error } = await supabaseAdmin
      .from('team_members')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating team member:', error)
      return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
    }

    // Log activity
    await logActivity('admin-user', 'update', teamMember.id, { 
      name: teamMember.name,
      changes: Object.keys(updateData)
    })

    return NextResponse.json({ data: teamMember })

  } catch (error) {
    console.error('Error in team member PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access
    const authResult = await verifyAdminAccess()
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    // Check if team member exists
    const { data: existingMember, error: fetchError } = await supabaseAdmin
      .from('team_members')
      .select('id, name')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    // Delete related records first
    await supabaseAdmin.from('project_team_members').delete().eq('team_member_id', params.id)

    // Delete team member
    const { error } = await supabaseAdmin
      .from('team_members')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting team member:', error)
      return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 })
    }

    // Log activity
    await logActivity('admin-user', 'delete', params.id, { 
      name: existingMember.name
    })

    return NextResponse.json({ message: 'Team member deleted successfully' })

  } catch (error) {
    console.error('Error in team member DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}