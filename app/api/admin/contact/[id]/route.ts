import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database-types'

// Use service role client for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Update contact submission using service role client
    const { data: submission, error } = await supabaseAdmin
      .from('contact_submissions')
      .update({
        is_read: body.is_read,
        admin_notes: body.admin_notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: submission })
  } catch (error) {
    console.error('Error updating contact submission:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete contact submission using service role client
    const { error } = await supabaseAdmin
      .from('contact_submissions')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Contact submission deleted successfully' })
  } catch (error) {
    console.error('Error deleting contact submission:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}