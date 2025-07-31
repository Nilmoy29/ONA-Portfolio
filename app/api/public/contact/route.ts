import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ 
        error: 'Name, email, and message are required' 
      }, { status: 400 })
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ 
        error: 'Please provide a valid email address' 
      }, { status: 400 })
    }
    
    // Validate message length
    if (data.message.length < 10) {
      return NextResponse.json({ 
        error: 'Message must be at least 10 characters long' 
      }, { status: 400 })
    }
    
    // Prepare insert data
    const insertData = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject?.trim() || 'Contact Form Submission',
      message: data.message.trim(),
      status: 'unread',
      is_read: false,
      admin_notes: null,
    }
    
    // Insert contact submission
    const { data: result, error } = await supabase
      .from('contact_submissions')
      .insert(insertData)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating contact submission:', error)
      return NextResponse.json({ 
        error: 'Failed to submit contact form. Please try again.' 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'Thank you for your message! We will get back to you soon.',
      data: result 
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Error in contact POST:', error)
    return NextResponse.json({ 
      error: 'Failed to submit contact form. Please try again.' 
    }, { status: 500 })
  }
}