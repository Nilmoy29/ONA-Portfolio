import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'

export async function GET(_request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('name, logo_url, is_published, sort_order')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching partners:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      // Degrade gracefully so the client can use fallbacks without 500 noise
      return NextResponse.json({ data: [] })
    }

    return NextResponse.json({ data: data || [] })
  } catch (error: any) {
    console.error('Error in partners GET:', error)
    // Degrade gracefully on unexpected errors
    return NextResponse.json({ data: [] })
  }
}