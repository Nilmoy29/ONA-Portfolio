import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create service role client that bypasses RLS
const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ 
        error: 'Name, email, and message are required' 
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Please enter a valid email address' 
      }, { status: 400 })
    }

    // Insert contact submission
    const { data: submission, error } = await supabaseAdmin
      .from('contact_submissions')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        is_read: false,
        status: 'new'
      })
      .select()
      .single()

    if (error) {
      console.error('Contact submission error:', error)
      return NextResponse.json({ 
        error: 'Failed to submit your message. Please try again.' 
      }, { status: 500 })
    }

    // Log activity (optional - if you want to track contact form submissions)
    try {
      await supabaseAdmin
        .from('admin_activity_logs')
        .insert({
          user_id: null, // No user for public submissions
          action: 'create',
          entity_type: 'contact_submission',
          entity_id: submission.id,
          details: {
            name: submission.name,
            email: submission.email,
            source: 'website_contact_form'
          }
        })
    } catch (logError) {
      // Don't fail the request if logging fails
      console.error('Failed to log contact submission:', logError)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
      id: submission.id
    }, { status: 201 })

  } catch (error: any) {
    console.error('Contact API Error:', error)
    return NextResponse.json({ 
      error: 'An unexpected error occurred. Please try again later.' 
    }, { status: 500 })
  }
}