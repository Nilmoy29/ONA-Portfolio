import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing simple database connection...')
    
    // Test 1: Basic count query
    const { count, error: countError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)
    
    if (countError) {
      return NextResponse.json({
        status: 'error',
        message: 'Count query failed',
        error: countError.message,
        code: countError.code
      }, { status: 500 })
    }
    
    // Test 2: Simple select query
    const { data, error: selectError } = await supabase
      .from('projects')
      .select('id, title')
      .eq('is_published', true)
      .limit(3)
    
    if (selectError) {
      return NextResponse.json({
        status: 'error',
        message: 'Select query failed',
        error: selectError.message,
        code: selectError.code
      }, { status: 500 })
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection working',
      results: {
        totalProjects: count,
        sampleProjects: data?.length || 0,
        sampleData: data?.map(p => ({ id: p.id, title: p.title })) || []
      }
    })
    
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Test failed',
      error: error?.message || 'Unknown error'
    }, { status: 500 })
  }
} 