import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('projects')
      .select('id, title')
      .eq('is_published', true)
      .limit(3)

    if (error) {
      return NextResponse.json({ 
        status: 'error',
        error: error.message,
        code: error.code
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Database connection working',
      projects: data,
      count: data?.length || 0
    })

  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error',
      error: error?.message || 'Unknown error'
    }, { status: 500 })
  }
} 