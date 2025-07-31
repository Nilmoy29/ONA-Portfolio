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
        entity_type: 'admin_user',
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
    
    const { data: user, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching admin user:', error)
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 })
    }

    return NextResponse.json({ data: user })

  } catch (error) {
    console.error('Error in admin user GET:', error)
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
    
    // Check if admin user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('admin_profiles')
      .select('id, full_name, user_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 })
    }

    // Prepare update data
    const allowedFields = [
      'full_name', 'role', 'permissions', 'is_active', 'avatar_url'
    ]
    
    const updateData: any = { updated_at: new Date().toISOString() }
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    })

    // Update admin user
    const { data: user, error } = await supabase
      .from('admin_profiles')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating admin user:', error)
      return NextResponse.json({ error: 'Failed to update admin user' }, { status: 500 })
    }

    // Log activity
    await logActivity(supabase, authResult.session.user.id, 'update', params.id, {
      full_name: user.full_name,
      changes: Object.keys(updateData)
    })

    return NextResponse.json({ data: user })

  } catch (error) {
    console.error('Error in admin user PUT:', error)
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
    
    // Check if admin user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('admin_profiles')
      .select('id, full_name, user_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 })
    }

    // Prevent self-deletion
    if (existingUser.user_id === authResult.session.user.id) {
      return NextResponse.json({ error: 'Cannot delete your own admin account' }, { status: 400 })
    }

    // Delete admin user
    const { error } = await supabase
      .from('admin_profiles')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting admin user:', error)
      return NextResponse.json({ error: 'Failed to delete admin user' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Admin user deleted successfully',
      data: { id: params.id, full_name: existingUser.full_name }
    })

  } catch (error) {
    console.error('Error in admin user DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}