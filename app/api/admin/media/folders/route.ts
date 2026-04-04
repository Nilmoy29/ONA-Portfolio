import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    // Get folders with file counts
    const { data: folders, error } = await supabaseAdmin
      .from('media_folders')
      .select(`
        *,
        file_count:media_files(count)
      `)
      .order('name')

    if (error) {
      console.error('Error fetching folders:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch folders' 
      }, { status: 500 })
    }

    // Transform data to include file count
    const foldersWithCount = folders?.map(folder => ({
      id: folder.id,
      name: folder.name,
      description: folder.description,
      createdAt: folder.created_at,
      updatedAt: folder.updated_at,
      fileCount: Array.isArray(folder.file_count) ? folder.file_count.length : 0
    })) || []

    return NextResponse.json({
      data: foldersWithCount
    })
  } catch (error: any) {
    console.error('Folders API Error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch folders' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json({ 
        error: 'Folder name is required' 
      }, { status: 400 })
    }

    const { data: folder, error } = await supabaseAdmin
      .from('media_folders')
      .insert({
        name: name.trim(),
        description: description?.trim() || null
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json({ 
          error: 'A folder with this name already exists' 
        }, { status: 409 })
      }
      console.error('Error creating folder:', error)
      return NextResponse.json({ 
        error: 'Failed to create folder' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      data: {
        id: folder.id,
        name: folder.name,
        description: folder.description,
        createdAt: folder.created_at,
        updatedAt: folder.updated_at,
        fileCount: 0
      }
    }, { status: 201 })
  } catch (error: any) {
    console.error('Folder creation error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create folder' 
    }, { status: 500 })
  }
}