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
    const status = searchParams.get('status') || ''
    
    let query = supabaseAdmin
      .from('newsletter_subscribers')
      .select('*', { count: 'exact' })
    
    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`)
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
    query = query.range(from, to).order('subscribed_at', { ascending: false })
    
    const { data, error, count } = await query
    
    if (error) {
      return NextResponse.json({ 
        error: error.message || 'Failed to fetch newsletter subscribers' 
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
      error: error.message || 'Failed to fetch newsletter subscribers' 
    }, { status: 500 })
  }
}

// Export for newsletters - bulk operations
export async function POST(request: NextRequest) {
  try {
    const { action, subscriber_ids } = await request.json()
    
    if (action === 'bulk_unsubscribe' && subscriber_ids) {
      const { error } = await supabaseAdmin
        .from('newsletter_subscribers')
        .update({ 
          is_active: false,
          unsubscribed_at: new Date().toISOString()
        })
        .in('id', subscriber_ids)
      
      if (error) {
        return NextResponse.json({ 
          error: error.message || 'Failed to unsubscribe users' 
        }, { status: 500 })
      }
      
      return NextResponse.json({ 
        message: `Successfully unsubscribed ${subscriber_ids.length} users` 
      })
    }
    
    if (action === 'bulk_delete' && subscriber_ids) {
      const { error } = await supabaseAdmin
        .from('newsletter_subscribers')
        .delete()
        .in('id', subscriber_ids)
      
      if (error) {
        return NextResponse.json({ 
          error: error.message || 'Failed to delete subscribers' 
        }, { status: 500 })
      }
      
      return NextResponse.json({ 
        message: `Successfully deleted ${subscriber_ids.length} subscribers` 
      })
    }
    
    return NextResponse.json({ 
      error: 'Invalid action' 
    }, { status: 400 })
    
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || 'Failed to process request' 
    }, { status: 500 })
  }
} 