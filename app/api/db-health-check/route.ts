import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Test 1: Basic connection
    const { data: basicData, error: basicError } = await supabase
      .from('projects')
      .select('count')
      .limit(1)
    
    const basicTime = Date.now() - startTime
    
    if (basicError) {
      return NextResponse.json({
        status: 'error',
        message: 'Basic connection failed',
        error: basicError,
        time: basicTime
      }, { status: 500 })
    }
    
    // Test 2: Simple query with limit
    const simpleStart = Date.now()
    const { data: simpleData, error: simpleError } = await supabase
      .from('projects')
      .select('id, title')
      .eq('is_published', true)
      .limit(5)
    
    const simpleTime = Date.now() - simpleStart
    
    // Test 3: Count query
    const countStart = Date.now()
    const { count, error: countError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)
    
    const countTime = Date.now() - countStart
    
    // Test 4: Categories query
    const categoriesStart = Date.now()
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name')
      .limit(5)
    
    const categoriesTime = Date.now() - categoriesStart
    
    const totalTime = Date.now() - startTime
    
    return NextResponse.json({
      status: 'success',
      message: 'Database health check completed',
      results: {
        basicConnection: {
          success: !basicError,
          time: basicTime,
          error: basicError?.message
        },
        simpleQuery: {
          success: !simpleError,
          time: simpleTime,
          dataCount: simpleData?.length || 0,
          error: simpleError?.message
        },
        countQuery: {
          success: !countError,
          time: countTime,
          count: count,
          error: countError?.message
        },
        categoriesQuery: {
          success: !categoriesError,
          time: categoriesTime,
          dataCount: categoriesData?.length || 0,
          error: categoriesError?.message
        }
      },
      totalTime,
      recommendations: {
        slowQueries: [
          ...(simpleTime > 1000 ? ['Simple query is slow'] : []),
          ...(countTime > 1000 ? ['Count query is slow'] : []),
          ...(categoriesTime > 1000 ? ['Categories query is slow'] : [])
        ],
        issues: [
          ...(basicError ? ['Basic connection failed'] : []),
          ...(simpleError ? ['Simple query failed'] : []),
          ...(countError ? ['Count query failed'] : []),
          ...(categoriesError ? ['Categories query failed'] : [])
        ]
      }
    })
    
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error?.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 })
  }
} 