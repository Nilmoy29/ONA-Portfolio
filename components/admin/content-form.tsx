"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { X, Upload } from 'lucide-react'
import { ExploreContent, TeamMember } from '@/lib/database-types'
import { supabase } from '@/lib/supabase'
import { ImageUpload } from '@/components/admin/image-upload'

interface ContentFormProps {
  content?: ExploreContent
  isEdit?: boolean
}

export function ContentForm({ content, isEdit = false }: ContentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    if (!content?.gallery_images) return []
    if (Array.isArray(content.gallery_images)) return content.gallery_images
    try {
      const parsed = typeof content.gallery_images === 'string' 
        ? JSON.parse(content.gallery_images) 
        : content.gallery_images
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  const [newImageUrl, setNewImageUrl] = useState('')
  const [uploadingFiles, setUploadingFiles] = useState(false)

  const [formData, setFormData] = useState({
    title: content?.title || '',
    slug: content?.slug || '',
    content_type: content?.content_type || 'article',
    content: content?.content || '',
    excerpt: content?.excerpt || '',
    featured_image_url: content?.featured_image_url || '',
    author_id: content?.author_id || null,
    is_published: content?.is_published || false,
  })

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const { data } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_published', true)
        .order('name')
      
      setTeamMembers(data || [])
    } catch (error) {
      console.error('Error fetching team members:', error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: !isEdit ? generateSlug(title) : prev.slug
    }))
  }

  const addGalleryImage = () => {
    if (newImageUrl.trim()) {
      setGalleryImages([...galleryImages, newImageUrl.trim()])
      setNewImageUrl('')
    }
  }

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const submitData = {
        ...formData,
        gallery_images: galleryImages,
      }

      const url = isEdit 
        ? `/api/admin/explore/${content?.id}`
        : '/api/admin/explore'
      
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/admin/explore')
      } else {
        setError(data.error || 'Failed to save content')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const contentTypeOptions = [
    { value: 'article', label: 'Article' },
    { value: 'artwork', label: 'Artwork' },
    { value: 'research', label: 'Research' },
    { value: 'photography', label: 'Photography' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-light text-zinc-900">
          {isEdit ? 'Edit Content' : 'Create Content'}
        </h2>
        <p className="text-zinc-600">
          {isEdit ? 'Update content information' : 'Add new article, artwork, research, or photography'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-light">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Content title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="content-slug"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content_type">Content Type *</Label>
                <Select
                  value={formData.content_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, content_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author_id">Author</Label>
                <Select
                  value={formData.author_id || undefined}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, author_id: value || null }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select author" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} {member.position && `(${member.position})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description or excerpt"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-light">Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ImageUpload
                value={formData.featured_image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, featured_image_url: url }))}
                label="Featured Image"
                placeholder="https://example.com/featured-image.jpg"
              />

              <div className="space-y-4">
                <Label>Gallery Images</Label>
                
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Image URL"
                    />
                    <Button type="button" onClick={addGalleryImage}>
                      Add
                    </Button>
                  </div>
                  
                  {galleryImages.length > 0 && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {galleryImages.map((url, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={url} 
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeGalleryImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <Label htmlFor="content-gallery-file-upload" className={`cursor-pointer ${uploadingFiles ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <div className={`flex items-center justify-center gap-2 px-4 py-8 border border-dashed rounded-lg transition-colors ${
                        uploadingFiles 
                          ? 'border-blue-300 bg-blue-50' 
                          : 'border-zinc-300 hover:border-zinc-400'
                      }`}>
                        <Upload className={`h-5 w-5 ${uploadingFiles ? 'animate-pulse text-blue-500' : ''}`} />
                        <span>
                          {uploadingFiles ? 'Processing images...' : 'Drop gallery images here or click to browse'}
                        </span>
                      </div>
                      <Input
                        id="content-gallery-file-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || [])
                          if (files.length === 0) return
                          
                          setUploadingFiles(true)
                          
                          const processFile = (file: File) => {
                            return new Promise<string | null>((resolve) => {
                              if (file.size > 15 * 1024 * 1024) {
                                console.warn(`Skipping ${file.name}: File too large`)
                                resolve(null)
                                return
                              }
                              
                              if (!file.type.startsWith('image/')) {
                                console.warn(`Skipping ${file.name}: Not an image file`)
                                resolve(null)
                                return
                              }

                              const reader = new FileReader()
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  resolve(event.target.result as string)
                                } else {
                                  resolve(null)
                                }
                              }
                              reader.onerror = () => resolve(null)
                              reader.readAsDataURL(file)
                            })
                          }
                          
                          try {
                            const results = await Promise.all(files.map(processFile))
                            const validDataUrls = results.filter((url): url is string => url !== null)
                            
                            if (validDataUrls.length > 0) {
                              setGalleryImages(prev => [...prev, ...validDataUrls])
                            }
                          } catch (error) {
                            console.error('Error processing files:', error)
                          } finally {
                            setUploadingFiles(false)
                            if (e.target) {
                              e.target.value = ''
                            }
                          }
                        }}
                        className="hidden"
                        disabled={uploadingFiles}
                      />
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light">Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="content">Content Body</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Main content body (supports markdown)"
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-sm text-zinc-600">
                You can use markdown formatting for rich text content.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium text-zinc-900">Published</Label>
                <p className="text-sm text-zinc-700 font-medium">
                  Make this content visible on the website
                </p>
              </div>
              <Switch
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-zinc-300"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/explore')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Content' : 'Create Content'}
          </Button>
        </div>
      </form>
    </div>
  )
}