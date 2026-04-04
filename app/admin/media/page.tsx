"use client"

import { MediaManager } from '@/components/admin/media-manager'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import { HardDrive, Image, Video, Music, FileText, Folder } from 'lucide-react'

interface MediaStats {
  totalFiles: number
  totalSize: number
  imageCount: number
  videoCount: number
  audioCount: number
  documentCount: number
  otherCount: number
  folderCount: number
}

export default function MediaPage() {
  const [stats, setStats] = useState<MediaStats>({
    totalFiles: 0,
    totalSize: 0,
    imageCount: 0,
    videoCount: 0,
    audioCount: 0,
    documentCount: 0,
    otherCount: 0,
    folderCount: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/media/stats')
      const data = await response.json()
      if (data.data) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching media stats:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-light text-zinc-900">Media Library</h2>
          <p className="text-zinc-600">Manage images, videos, documents and other media files</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <HardDrive className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-600">Total Files</p>
                <p className="text-2xl font-light">{stats.totalFiles}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <HardDrive className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-600">Total Size</p>
                <p className="text-2xl font-light">{formatFileSize(stats.totalSize)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Image className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-600">Images</p>
                <p className="text-2xl font-light">{stats.imageCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Folder className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-600">Folders</p>
                <p className="text-2xl font-light">{stats.folderCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-red-600" />
                <span className="text-sm">Videos</span>
              </div>
              <Badge variant="outline">{stats.videoCount}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Audio</span>
              </div>
              <Badge variant="outline">{stats.audioCount}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-600" />
                <span className="text-sm">Documents</span>
              </div>
              <Badge variant="outline">{stats.documentCount}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-zinc-600" />
                <span className="text-sm">Other</span>
              </div>
              <Badge variant="outline">{stats.otherCount}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-light">Media Files</CardTitle>
        </CardHeader>
        <CardContent>
          <MediaManager showUpload={true} />
        </CardContent>
      </Card>
    </div>
  )
}