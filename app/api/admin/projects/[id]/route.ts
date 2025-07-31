import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Fallback configuration (same as logs route)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oscicdyjpnnykyqpvuys.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY2ljZHlqcG5ueWt5cXB2dXlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM2MTc5NywiZXhwIjoyMDY3OTM3Nzk3fQ.RFGdVve9Gq9I19YKsDSBmKIFSEJDi0141l5JkbkFQgI'

// Create service role client that bypasses RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

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
        entity_type: 'project',
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
    const authResult = await verifyAdminAccess(request.headers.get('authorization'))
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    // Use service role client for data operations to avoid RLS issues
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select(`
        *,
        categories (name, slug),
        project_partners (
          partners (id, name, slug, logo_url)
        ),
        project_team_members (
          team_members (id, name, slug, position)
        )
      `)
      .eq('id', params.id)
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 PUT /api/admin/projects/[id] - Starting request for ID:', params.id)
    console.log('📋 Environment check:')
    console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing')
    console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing')
    
    // Verify admin access
    const authResult = await verifyAdminAccess(request.headers.get('authorization'))
    if (!authResult.authorized) {
      console.log('❌ Admin access denied')
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const body = await request.json()
    console.log('📥 Received update data keys:', Object.keys(body))
    console.log('📥 Received update data:', JSON.stringify(body, null, 2))
    
    // Test Supabase connection first
    try {
      const { data: testQuery, error: testError } = await supabaseAdmin
        .from('projects')
        .select('count(*)')
        .limit(1)
      
      if (testError) {
        console.error('❌ Supabase connection test failed:', testError)
        return NextResponse.json({ 
          error: 'Database connection failed',
          details: testError.message 
        }, { status: 500 })
      }
      
      console.log('✅ Supabase connection test passed')
    } catch (connError) {
      console.error('❌ Supabase connection error:', connError)
      return NextResponse.json({ 
        error: 'Database connection error',
        details: connError instanceof Error ? connError.message : 'Unknown error'
      }, { status: 500 })
    }
    
    // Check if project exists
    console.log('🔍 Checking if project exists with ID:', params.id)
    const { data: existingProject, error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('id, slug, title')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingProject) {
      console.error('❌ Project not found:', fetchError)
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    console.log('✅ Project exists:', existingProject.title)

    // Check for duplicate slug if slug is being changed
    if (body.slug && body.slug !== existingProject.slug) {
      console.log('🔍 Checking for duplicate slug:', body.slug)
      const { data: duplicateProject } = await supabaseAdmin
        .from('projects')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', params.id)
        .single()

      if (duplicateProject) {
        console.log('❌ Duplicate slug found')
        return NextResponse.json({ error: 'A project with this slug already exists' }, { status: 409 })
      }
      
      console.log('✅ Slug is unique')
    }

    // Prepare update data
    const allowedFields = [
      'title', 'slug', 'description', 'content', 'category_id', 'featured_image_url', 
      'gallery_images', 'features', 'client_name', 'location', 'project_status', 
      'is_published', 'sort_order'
    ]
    
    // Extract team member IDs before updating project
    const teamMemberIds = body.team_member_ids || []
    
    const updateData: any = { updated_at: new Date().toISOString() }
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    })
    
    console.log('📤 Update data to apply:', JSON.stringify(updateData, null, 2))

    // Update project using service role client
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('❌ Error updating project:', error)
      return NextResponse.json({ 
        error: 'Failed to update project',
        details: error.message 
      }, { status: 500 })
    }
    
    console.log('✅ Project updated successfully')

    // Update team member relationships
    if (Array.isArray(teamMemberIds)) {
      console.log('👥 Updating team member relationships for:', teamMemberIds)
      
      try {
        // First, delete existing relationships
        const { error: deleteError } = await supabaseAdmin
          .from('project_team_members')
          .delete()
          .eq('project_id', params.id)
        
        if (deleteError) {
          console.error('❌ Error deleting existing team member relationships:', deleteError)
          // Don't fail the entire request, just log the error
        } else {
          console.log('✅ Existing team member relationships deleted')
        }
        
        // Then, create new relationships if any team members were selected
        if (teamMemberIds.length > 0) {
          // Filter out any empty or invalid IDs
          const validTeamMemberIds = teamMemberIds.filter(id => id && id.trim() !== '')
          
          if (validTeamMemberIds.length > 0) {
            const teamMemberRelations = validTeamMemberIds.map((teamMemberId: string) => ({
              project_id: params.id,
              team_member_id: teamMemberId.trim()
            }))
            
            const { error: teamError } = await supabaseAdmin
              .from('project_team_members')
              .insert(teamMemberRelations)
            
            if (teamError) {
              console.error('❌ Error updating team member relationships:', teamError)
              // Don't fail the entire request, just log the error
            } else {
              console.log('✅ Team member relationships updated successfully')
            }
          } else {
            console.log('ℹ️ No valid team member IDs provided, skipping relationship creation')
          }
        } else {
          console.log('ℹ️ No team members selected, relationships cleared')
        }
      } catch (relationshipError) {
        console.error('❌ Error in team member relationship update:', relationshipError)
        // Don't fail the entire request, just log the error
      }
    }

    // Log activity
    await logActivity(
      'admin-user', // For now, using a default admin user ID
      'update',
      project.id,
      { 
        title: project.title,
        changes: Object.keys(updateData)
      }
    )
    
    console.log('🎉 PUT request completed successfully')
    return NextResponse.json({ data: project })

  } catch (error: any) {
    console.error('❌ Critical error in PUT /api/admin/projects/[id]:', error)
    console.error('❌ Error stack:', error.stack)
    console.error('❌ Error message:', error.message)
    console.error('❌ Error code:', error.code)
    console.error('❌ Error details:', error.details)
    console.error('❌ Error hint:', error.hint)
    
    return NextResponse.json({ 
      error: error.message || 'Internal server error',
      type: error.constructor.name,
      code: error.code,
      details: error.details,
      hint: error.hint,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
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
    
    // Check if project exists
    const { data: existingProject, error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('id, title')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Delete project using service role client
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting project:', error)
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
    }

    // Log activity
    await logActivity(
      'admin-user',
      'delete',
      params.id,
      { title: existingProject.title }
    )

    return NextResponse.json({ message: 'Project deleted successfully' })

  } catch (error) {
    console.error('Error in project DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}