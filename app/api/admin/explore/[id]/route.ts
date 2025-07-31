import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database-types'

// Use service role client for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Use service role client for admin operations - bypasses RLS and authentication issues
    const { data: content, error } = await supabaseAdmin
      .from('explore_content')
      .select(`
        *,
        team_members (
          id,
          name,
          position,
          profile_image_url
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    return NextResponse.json({ data: content })
  } catch (error) {
    console.error('Error fetching explore content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to validate author_id before database operations
async function validateAuthorId(authorId: string | null | undefined) {
  if (authorId === null || authorId === undefined) {
    return { valid: true, message: 'Author ID is optional' }
  }
  
  // Check if author_id exists in team_members table
  const { data: teamMember, error } = await supabaseAdmin
    .from('team_members')
    .select('id, is_published')
    .eq('id', authorId)
    .single()
  
  if (error || !teamMember) {
    return { 
      valid: false, 
      message: `Invalid author_id: ${authorId}. Team member not found.` 
    }
  }
  
  if (!teamMember.is_published) {
    return { 
      valid: false, 
      message: `Author ID ${authorId} references an unpublished team member.` 
    }
  }
  
  return { valid: true, message: 'Author ID is valid' }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate content_type if provided
    if (body.content_type) {
      const validContentTypes = ['article', 'artwork', 'research', 'photography']
      if (!validContentTypes.includes(body.content_type)) {
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
      }
    }

    // Validate author_id if provided
    if (body.author_id !== undefined) {
      const validation = await validateAuthorId(body.author_id)
      if (!validation.valid) {
        return NextResponse.json({ error: validation.message }, { status: 400 })
      }
    }

    // Use service role client for admin operations - bypasses RLS and authentication issues
    const { data: content, error } = await supabaseAdmin
      .from('explore_content')
      .update({
        title: body.title,
        slug: body.slug,
        content_type: body.content_type,
        content: body.content,
        excerpt: body.excerpt,
        featured_image_url: body.featured_image_url,
        gallery_images: body.gallery_images,
        author_id: body.author_id,
        is_published: body.is_published,
        published_at: body.is_published ? (body.published_at || new Date().toISOString()) : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity (using admin role since we don't have session)
    await supabaseAdmin.from('activity_logs').insert({
      user_id: content.author_id || 'admin',
      action: 'UPDATE',
      entity_type: 'explore_content',
      entity_id: content.id,
      details: {
        title: content.title,
        content_type: content.content_type,
        is_published: content.is_published
      }
    })

    return NextResponse.json({ data: content })
  } catch (error) {
    console.error('Error updating explore content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Use service role client for admin operations - bypasses RLS and authentication issues
    const { data: existingContent, error: fetchError } = await supabaseAdmin
      .from('explore_content')
      .select('id, title')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingContent) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Delete explore content
    const { error } = await supabaseAdmin
      .from('explore_content')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting explore content:', error)
      return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Content deleted successfully',
      data: { id: params.id, title: existingContent.title }
    })

  } catch (error) {
    console.error('Error in explore content DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}