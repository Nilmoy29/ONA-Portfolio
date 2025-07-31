import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const status = searchParams.get('status') || ''
    
    let query = supabaseAdmin
      .from('admin_profiles')
      .select('*', { count: 'exact' })
    
    if (search) {
      query = query.or(`full_name.ilike.%${search}%`)
    }
    
    if (role) {
      query = query.eq('role', role)
    }
    
    if (status) {
      switch (status) {
        case 'active':
          query = query.eq('is_active', true)
          break
        case 'inactive':
          query = query.eq('is_active', false)
          break
      }
    }
    
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('created_at', { ascending: false })
    
    const { data, error, count } = await query
    
    if (error) {
      return NextResponse.json({ 
        error: error.message || 'Failed to fetch users' 
      }, { status: 500 })
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
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch users' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.full_name || !data.user_id || !data.role) {
      return NextResponse.json({ 
        error: 'Full name, user ID, and role are required' 
      }, { status: 400 })
    }
    
    // Check for duplicate user_id
    const { data: existingUser } = await supabaseAdmin
      .from('admin_profiles')
      .select('id')
      .eq('user_id', data.user_id)
      .single()
    
    if (existingUser) {
      return NextResponse.json({ 
        error: 'A user with this ID already exists' 
      }, { status: 409 })
    }
    
    // Set default permissions based on role
    const permissions = {
      can_manage_users: data.role === 'admin',
      can_manage_content: ['admin', 'editor'].includes(data.role),
      can_manage_settings: data.role === 'admin',
      can_view_analytics: ['admin', 'editor'].includes(data.role),
      can_manage_partners: ['admin', 'editor'].includes(data.role),
      can_manage_projects: ['admin', 'editor'].includes(data.role),
      can_manage_team: ['admin', 'editor'].includes(data.role),
      can_manage_services: ['admin', 'editor'].includes(data.role),
      can_manage_explore: ['admin', 'editor'].includes(data.role),
    }
    
    // Prepare insert data
    const insertData = {
      user_id: data.user_id,
      full_name: data.full_name,
      role: data.role,
      is_active: data.is_active ?? true,
      permissions: permissions,
      avatar_url: data.avatar_url || null,
      last_login: null,
    }
    
    const { data: result, error } = await supabaseAdmin
      .from('admin_profiles')
      .insert(insertData)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating user:', error)
      return NextResponse.json({ 
        error: error.message || 'Failed to create user' 
      }, { status: 500 })
    }
    
    return NextResponse.json({ data: result }, { status: 201 })
  } catch (error: any) {
    console.error('Error in user POST:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create user' 
    }, { status: 500 })
  }
}