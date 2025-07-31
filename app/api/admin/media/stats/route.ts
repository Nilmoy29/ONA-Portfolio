import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would query your media table for statistics
    // For now, we'll return mock statistics
    const mockStats = {
      totalFiles: 42,
      totalSize: 157286400, // ~150MB
      imageCount: 28,
      videoCount: 6,
      audioCount: 3,
      documentCount: 4,
      otherCount: 1,
      folderCount: 4
    }

    return NextResponse.json({
      data: mockStats
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch media statistics' 
    }, { status: 500 })
  }
}