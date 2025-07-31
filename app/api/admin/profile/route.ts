import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    console.log('🔍 API: Fetching admin profile for user:', userId)
    
    // Query admin_profiles with service role to bypass RLS
    const { data: profile, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      console.error('❌ API: Error fetching profile:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    console.log('✅ API: Profile fetched successfully')
    
    return NextResponse.json({ profile })
    
  } catch (error) {
    console.error('❌ API: Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, ...profileData } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    console.log('🆕 API: Creating admin profile for user:', userId)
    
    // Create admin profile with service role to bypass RLS
    const { data: profile, error } = await supabase
      .from('admin_profiles')
      .insert([{
        user_id: userId,
        role: 'admin',
        is_active: true,
        permissions: {
          projects: { create: true, read: true, update: true, delete: true },
          team_members: { create: true, read: true, update: true, delete: true },
          services: { create: true, read: true, update: true, delete: true },
          explore_content: { create: true, read: true, update: true, delete: true },
          partners: { create: true, read: true, update: true, delete: true },
          contact_submissions: { create: false, read: true, update: true, delete: true },
          site_settings: { create: true, read: true, update: true, delete: true },
          admin_users: { create: true, read: true, update: true, delete: true }
        },
        login_count: 1,
        last_login: new Date().toISOString(),
        ...profileData
      }])
      .select()
      .single()
    
    if (error) {
      console.error('❌ API: Error creating profile:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    console.log('✅ API: Profile created successfully')
    
    return NextResponse.json({ profile })
    
  } catch (error) {
    console.error('❌ API: Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}