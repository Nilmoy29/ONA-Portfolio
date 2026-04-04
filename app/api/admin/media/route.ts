import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const folder = searchParams.get('folder') || ''
    const type = searchParams.get('type') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabaseAdmin
      .from('media_files')
      .select('*', { count: 'exact' })

    if (search) {
      query = query.or(`name.ilike.%${search}%,original_name.ilike.%${search}%,alt_text.ilike.%${search}%`)
    }

    if (folder && folder !== 'all') {
      query = query.eq('folder', folder)
    }

    if (type && type !== 'all') {
      query = query.eq('file_type', type)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching media files:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch media files' 
      }, { status: 500 })
    }

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error: any) {
    console.error('Media API Error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch media files' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'general'
    const altText = formData.get('altText') as string || ''
    const description = formData.get('description') as string || ''

    if (!file) {
      return NextResponse.json({ 
        error: 'No file provided' 
      }, { status: 400 })
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ 
        error: 'Failed to upload file to storage' 
      }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('media')
      .getPublicUrl(filePath)

    // Determine file type
    const getFileType = (mimeType: string): string => {
      if (mimeType.startsWith('image/')) return 'image'
      if (mimeType.startsWith('video/')) return 'video'
      if (mimeType.startsWith('audio/')) return 'audio'
      if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'document'
      return 'other'
    }

    // Save file metadata to database
    const { data: mediaFile, error: dbError } = await supabaseAdmin
      .from('media_files')
      .insert({
        name: fileName,
        original_name: file.name,
        file_path: filePath,
        file_url: urlData.publicUrl,
        file_size: file.size,
        mime_type: file.type,
        file_type: getFileType(file.type),
        folder,
        alt_text: altText,
        description,
        metadata: {
          width: null,
          height: null,
          duration: null
        }
      })
      .select()
      .single()

    if (dbError) {
      // Clean up uploaded file if database save fails
      await supabaseAdmin.storage.from('media').remove([filePath])
      console.error('Database error:', dbError)
      return NextResponse.json({ 
        error: 'Failed to save file metadata' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      data: mediaFile 
    }, { status: 201 })
  } catch (error: any) {
    console.error('Media upload error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to upload file' 
    }, { status: 500 })
  }
}