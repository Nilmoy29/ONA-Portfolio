import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Simple test route called')
    
    return NextResponse.json({
      status: 'success',
      message: 'Simple test working',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    })
  } catch (error: any) {
    console.error('❌ Simple test error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
} 