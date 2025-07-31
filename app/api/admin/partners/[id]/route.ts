import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/database-types'

// Helper function to verify admin access
async function verifyAdminAccess(supabase: any) {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError || !session) {
    return { authorized: false, error: 'Unauthorized', status: 401 }
  }

  const { data: adminProfile, error: profileError } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('is_active', true)
    .single()

  if (profileError || !adminProfile) {
    return { authorized: false, error: 'Forbidden', status: 403 }
  }

  return { authorized: true, session, adminProfile }
}

// Helper function to log activity
async function logActivity(supabase: any, userId: string, action: string, entityId?: string, details?: any) {
  try {
    await supabase
      .from('admin_activity_logs')
      .insert({
        user_id: userId,
        action,
        entity_type: 'partner',
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
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Verify admin access
    const authResult = await verifyAdminAccess(supabase)
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const { data: partner, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching partner:', error)
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    return NextResponse.json({ data: partner })

  } catch (error) {
    console.error('Error in partner GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Verify admin access
    const authResult = await verifyAdminAccess(supabase)
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const body = await request.json()
    
    // Check if partner exists
    const { data: existingPartner, error: fetchError } = await supabase
      .from('partners')
      .select('id, slug, name')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingPartner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    // Check for duplicate slug if slug is being changed
    if (body.slug && body.slug !== existingPartner.slug) {
      const { data: duplicatePartner } = await supabase
        .from('partners')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', params.id)
        .single()

      if (duplicatePartner) {
        return NextResponse.json({ error: 'A partner with this slug already exists' }, { status: 409 })
      }
    }

    // Prepare update data with database schema fields
    const updateData = {
      ...(body.name && { name: body.name }),
      ...(body.slug && { slug: body.slug }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.logo_url !== undefined && { logo_url: body.logo_url }),
      ...(body.website_url !== undefined && { website_url: body.website_url }),
      ...(body.is_published !== undefined && { is_published: body.is_published }),
      ...(body.sort_order !== undefined && { sort_order: body.sort_order }),
      updated_at: new Date().toISOString()
    }

    // Update partner
    const { data: partner, error } = await supabase
      .from('partners')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating partner:', error)
      return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 })
    }

    // Log activity
    await logActivity(supabase, authResult.session.user.id, 'update', params.id, {
      name: partner.name,
      changes: Object.keys(updateData)
    })

    return NextResponse.json({ data: partner })

  } catch (error) {
    console.error('Error in partner PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Verify admin access
    const authResult = await verifyAdminAccess(supabase)
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    // Check if partner exists
    const { data: existingPartner, error: fetchError } = await supabase
      .from('partners')
      .select('id, name')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingPartner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    // Delete related records first
    await supabase.from('project_partners').delete().eq('partner_id', params.id)

    // Delete partner
    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting partner:', error)
      return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 })
    }

    // Log activity
    await logActivity(supabase, authResult.session.user.id, 'delete', params.id, {
      name: existingPartner.name
    })

    return NextResponse.json({ message: 'Partner deleted successfully' })

  } catch (error) {
    console.error('Error in partner DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}