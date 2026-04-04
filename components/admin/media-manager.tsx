"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Upload, 
  Search, 
  Grid, 
  List, 
  Filter,
  Image,
  FileText,
  Video,
  Music,
  File,
  Trash2,
  Edit,
  Copy,
  Download,
  Eye,
  FolderPlus,
  Folder
} from 'lucide-react'

interface MediaFile {
  id: string
  name: string
  url: string
  type: 'image' | 'video' | 'audio' | 'document' | 'other'
  size: number
  mimeType: string
  folder: string
  createdAt: string
  updatedAt: string
  metadata?: {
    width?: number
    height?: number
    duration?: number
    alt?: string
    caption?: string
  }
}

interface MediaManagerProps {
  onSelect?: (file: MediaFile) => void
  allowMultiple?: boolean
  acceptedTypes?: string[]
  maxFileSize?: number
  showUpload?: boolean
}

export function MediaManager({ 
  onSelect, 
  allowMultiple = false, 
  acceptedTypes = ['image/*', 'video/*', 'audio/*', 'application/*'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  showUpload = true
}: MediaManagerProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [folders, setFolders] = useState<string[]>(['Images', 'Documents', 'Videos', 'Other'])

  useEffect(() => {
    fetchFiles()
  }, [selectedFolder, selectedType, search])

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(selectedFolder !== 'all' && { folder: selectedFolder }),
        ...(selectedType !== 'all' && { type: selectedType }),
      })

      const response = await fetch(`/api/admin/media?${params}`)
      const data = await response.json()

      if (data.data) {
        setFiles(data.data)
      }
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || [])
    if (uploadedFiles.length === 0) return

    setUploading(true)
    try {
      for (const file of uploadedFiles) {
        if (file.size > maxFileSize) {
          alert(`File ${file.name} is too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB`)
          continue
        }

        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', selectedFolder === 'all' ? 'Other' : selectedFolder)

        const response = await fetch('/api/admin/media', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }
      }

      fetchFiles()
    } catch (error) {
      console.error('Error uploading files:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    try {
      const response = await fetch('/api/admin/media/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newFolderName }),
      })

      if (response.ok) {
        setFolders([...folders, newFolderName])
        setNewFolderName('')
        setShowCreateFolder(false)
      }
    } catch (error) {
      console.error('Error creating folder:', error)
    }
  }

  const handleFileSelect = (file: MediaFile) => {
    if (allowMultiple) {
      setSelectedFiles(prev => 
        prev.includes(file.id) 
          ? prev.filter(id => id !== file.id)
          : [...prev, file.id]
      )
    } else {
      onSelect?.(file)
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/admin/media/${fileId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchFiles()
      }
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />
      case 'video':
        return <Video className="h-4 w-4" />
      case 'audio':
        return <Music className="h-4 w-4" />
      case 'document':
        return <FileText className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase())
    const matchesFolder = selectedFolder === 'all' || file.folder === selectedFolder
    const matchesType = selectedType === 'all' || file.type === selectedType
    return matchesSearch && matchesFolder && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={selectedFolder} onValueChange={setSelectedFolder}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Folders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Folders</SelectItem>
              {folders.map(folder => (
                <SelectItem key={folder} value={folder}>{folder}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
          >
            {view === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
          <Dialog open={showCreateFolder} onOpenChange={setShowCreateFolder}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>
                  Create a new folder to organize your media files.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="folderName">Folder Name</Label>
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter folder name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                  Create Folder
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {showUpload && (
            <div className="relative">
              <Button disabled={uploading}>
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Files'}
              </Button>
              <input
                type="file"
                multiple
                accept={acceptedTypes.join(',')}
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={uploading}
              />
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-square bg-zinc-200 rounded-lg mb-2"></div>
                <div className="h-4 bg-zinc-200 rounded mb-2"></div>
                <div className="h-3 bg-zinc-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className={view === 'grid' ? 
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 
          'space-y-2'
        }>
          {filteredFiles.map(file => (
            <Card 
              key={file.id} 
              className={`cursor-pointer transition-colors ${
                selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleFileSelect(file)}
            >
              {view === 'grid' ? (
                <CardContent className="p-4">
                  <div className="aspect-square bg-zinc-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {file.type === 'image' ? (
                      <img 
                        src={file.url} 
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-zinc-400 text-3xl">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm truncate">{file.name}</h3>
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span>{formatFileSize(file.size)}</span>
                      <Badge variant="outline" className="text-xs">
                        {file.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-2">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Download className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={(e) => e.stopPropagation()}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete File</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{file.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteFile(file.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center">
                      {file.type === 'image' ? (
                        <img 
                          src={file.url} 
                          alt={file.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        getFileIcon(file.type)
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{file.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-zinc-500">
                        <span>{formatFileSize(file.size)}</span>
                        <Badge variant="outline">{file.type}</Badge>
                        <span>{file.folder}</span>
                        <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete File</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{file.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteFile(file.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {filteredFiles.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-zinc-500 mb-4">
            <Upload className="h-12 w-12 mx-auto mb-4" />
            <p>No files found</p>
            <p className="text-sm">Upload some files to get started</p>
          </div>
        </div>
      )}

      {allowMultiple && selectedFiles.length > 0 && (
        <div className="fixed bottom-4 right-4">
          <Button onClick={() => {
            const selected = files.filter(f => selectedFiles.includes(f.id))
            selected.forEach(file => onSelect?.(file))
          }}>
            Select {selectedFiles.length} Files
          </Button>
        </div>
      )}
    </div>
  )
}