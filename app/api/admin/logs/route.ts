import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database-types'

// Fallback configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oscicdyjpnnykyqpvuys.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY2ljZHlqcG5ueWt5cXB2dXlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM2MTc5NywiZXhwIjoyMDY3OTM3Nzk3fQ.RFGdVve9Gq9I19YKsDSBmKIFSEJDi0141l5JkbkFQgI'

// Create admin client that bypasses RLS
const adminSupabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Admin Logs API: Starting GET request')

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const action = searchParams.get('action') || ''
    const table_name = searchParams.get('table_name') || ''

    // Build query using admin client to bypass RLS - Use correct table name
    let query = adminSupabase
      .from('admin_activity_logs')
      .select(`
        *,
        admin_profiles(
          full_name,
          role
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply filters
    if (action) {
      query = query.eq('action', action)
    }
    if (table_name) {
      query = query.eq('table_name', table_name)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Execute query
    const { data: logs, error, count } = await query

    if (error) {
      console.error('❌ Logs API Error:', error)
      // Return empty data if table doesn't exist yet (no logs)
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        return NextResponse.json({
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0
          }
        })
      }
      return NextResponse.json({ 
        error: `Database error: ${error.message}`,
        details: error 
      }, { status: 500 })
    }

    console.log(`✅ Logs API: Retrieved ${logs?.length || 0} logs`)

    return NextResponse.json({
      data: logs || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error: any) {
    console.error('Error fetching activity logs:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 })
  }
}