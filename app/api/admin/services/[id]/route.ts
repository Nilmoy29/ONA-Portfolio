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
        entity_type: 'service',
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
    // const supabase = createRouteHandlerClient<Database>({ cookies }) // This line is removed
    
    // Verify admin access
    const authResult = await verifyAdminAccess(request.headers.get('authorization'))
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const { data, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error) {
      console.error('Error fetching service:', error)
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }
    
    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error in service GET:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access
    const authResult = await verifyAdminAccess(request.headers.get('authorization'))
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const body = await request.json()
    
    // Check if service exists
    const { data: existingService, error: checkError } = await supabaseAdmin
      .from('services')
      .select('id, slug, name')
      .eq('id', params.id)
      .single()
    
    if (checkError || !existingService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }
    
    // Check for duplicate slug if slug is being changed
    if (body.slug && body.slug !== existingService.slug) {
      const { data: duplicateCheck } = await supabaseAdmin
        .from('services')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', params.id)
        .single()
      
      if (duplicateCheck) {
        return NextResponse.json({ error: 'A service with this slug already exists' }, { status: 409 })
      }
    }
    
    // Prepare update data
    const allowedFields = [
      'name', 'slug', 'description', 'service_type',
      'icon', 'featured_image_url', 'is_published', 'sort_order'
    ]
    
    const updateData: any = { updated_at: new Date().toISOString() }
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    })
    
    const { data, error } = await supabaseAdmin
      .from('services')
      .update(updateData)
      .eq('id', params.id)
      .select('*')
      .single()
    
    if (error) {
      console.error('Error updating service:', error)
      return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
    }
    
          // Log activity
      await logActivity('admin-user', 'update', params.id, {
        name: data.name,
        changes: Object.keys(updateData)
      })
    
    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error in service PUT:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access
    const authResult = await verifyAdminAccess(request.headers.get('authorization'))
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    // Check if service exists
    const { data: existingService, error: checkError } = await supabaseAdmin
      .from('services')
      .select('id, name')
      .eq('id', params.id)
      .single()
    
    if (checkError || !existingService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }
    
    // Delete service using service role client
    const { error } = await supabaseAdmin
      .from('services')
      .delete()
      .eq('id', params.id)
    
    if (error) {
      console.error('Error deleting service:', error)
      return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'Service deleted successfully',
      data: { id: params.id, name: existingService.name }
    })
    
  } catch (error: any) {
    console.error('Error in service DELETE:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}