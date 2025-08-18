import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    let query = supabase
      .from('partners')
      .select('*', { count: 'exact' })

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (status) {
      switch (status) {
        case 'published':
          query = query.eq('is_published', true)
          break
        case 'draft':
          query = query.eq('is_published', false)
          break
        case 'active':
          query = query.eq('is_published', true)
          break
        case 'inactive':
          query = query.eq('is_published', false)
          break
        case 'pending':
          query = query.eq('is_published', false)
          break
      }
    }

    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('sort_order', { ascending: true })

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching partners:', error)
      return NextResponse.json({ error: error.message || 'Failed to fetch partners' }, { status: 500 })
    }

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error: any) {
    console.error('Error in partners GET:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch partners' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.name || !data.slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    const { data: existingPartner } = await supabase
      .from('partners')
      .select('id')
      .eq('slug', data.slug)
      .maybeSingle()

    if (existingPartner) {
      return NextResponse.json({ error: 'A partner with this slug already exists' }, { status: 409 })
    }

    const insertData = {
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      logo_url: data.logo_url || null,
      website_url: data.website_url || null,
      partnership_type: data.partnership_type || null,
      location: data.location || null,
      established_year: data.established_year || null,
      is_published: data.is_published ?? true,
      sort_order: data.sort_order || 0,
    }

    const { data: result, error } = await supabase
      .from('partners')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Error creating partner:', error)
      return NextResponse.json({ error: error.message || 'Failed to create partner' }, { status: 500 })
    }

    return NextResponse.json({ data: result }, { status: 201 })
  } catch (error: any) {
    console.error('Error in partner POST:', error)
    return NextResponse.json({ error: error.message || 'Failed to create partner' }, { status: 500 })
  }
}