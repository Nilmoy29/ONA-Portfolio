import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
        .maybeSingle()

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

    return NextResponse.json({ message: 'Partner deleted successfully' })

  } catch (error) {
    console.error('Error in partner DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}