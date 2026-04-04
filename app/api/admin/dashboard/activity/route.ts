import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create service role client that bypasses RLS
const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get recent activity logs with admin profile info
    const { data: activities, error } = await supabaseAdmin
      .from('admin_activity_logs')
      .select(`
        *,
        admin_profiles (
          full_name,
          role
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Dashboard activity API Error:', error)
      return NextResponse.json({ 
        error: error.message || 'Failed to fetch recent activities' 
      }, { status: 500 })
    }

    return NextResponse.json({ data: activities || [] })
  } catch (error: any) {
    console.error('Dashboard activity API Error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch recent activities' 
    }, { status: 500 })
  }
}