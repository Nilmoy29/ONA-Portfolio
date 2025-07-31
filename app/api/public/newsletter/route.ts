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
    if (!data.email) {
      return NextResponse.json({ 
        error: 'Email is required' 
      }, { status: 400 })
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ 
        error: 'Please provide a valid email address' 
      }, { status: 400 })
    }
    
    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', data.email.trim().toLowerCase())
      .single()
    
    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        return NextResponse.json({ 
          error: 'This email is already subscribed to our newsletter' 
        }, { status: 409 })
      } else {
        // Reactivate existing subscriber
        const { error } = await supabase
          .from('newsletter_subscribers')
          .update({ 
            is_active: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSubscriber.id)
        
        if (error) {
          console.error('Error reactivating subscriber:', error)
          return NextResponse.json({ 
            error: 'Failed to subscribe. Please try again.' 
          }, { status: 500 })
        }
        
        return NextResponse.json({ 
          message: 'Successfully subscribed to our newsletter!' 
        }, { status: 200 })
      }
    }
    
    // Create new subscriber
    const insertData = {
      email: data.email.trim().toLowerCase(),
      name: data.name?.trim() || null,
      is_active: true,
      subscribed_at: new Date().toISOString(),
    }
    
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert(insertData)
    
    if (error) {
      console.error('Error creating newsletter subscriber:', error)
      return NextResponse.json({ 
        error: 'Failed to subscribe. Please try again.' 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'Successfully subscribed to our newsletter!' 
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Error in newsletter POST:', error)
    return NextResponse.json({ 
      error: 'Failed to subscribe. Please try again.' 
    }, { status: 500 })
  }
}