"use client"

import { useState } from 'react'
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
import { Service } from '@/lib/database-types'
import { ImageUpload } from '@/components/admin/image-upload'

interface ServiceFormProps {
  service?: Service
  isEdit?: boolean
}

export function ServiceForm({ service, isEdit = false }: ServiceFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    if (!service?.gallery_images) return []
    if (Array.isArray(service.gallery_images)) return service.gallery_images
    try {
      const parsed = typeof service.gallery_images === 'string' 
        ? JSON.parse(service.gallery_images) 
        : service.gallery_images
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  const [newImageUrl, setNewImageUrl] = useState('')
  const [uploadingFiles, setUploadingFiles] = useState(false)

  const [formData, setFormData] = useState({
    name: service?.name || '',
    slug: service?.slug || '',
    description: service?.description || '',
    long_description: service?.long_description || '',
    service_type: service?.service_type || 'design',
    icon: service?.icon || '',
    featured_image_url: service?.featured_image_url || '',
    is_published: service?.is_published || false,
    sort_order: service?.sort_order || 0,
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: !isEdit ? generateSlug(name) : prev.slug
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
        ? `/api/admin/services/${service?.id}`
        : '/api/admin/services'
      
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
        router.push('/admin/services')
      } else {
        setError(data.error || 'Failed to save service')
      }
    } catch (error) {
      console.error('Error saving service:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-light text-zinc-900">
          {isEdit ? 'Edit Service' : 'Create Service'}
        </h2>
        <p className="text-zinc-600">
          {isEdit ? 'Update service information' : 'Add a new service to your portfolio'}
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
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Service name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="service-slug"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief service description"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="long_description">Long Description</Label>
                <Textarea
                  id="long_description"
                  value={formData.long_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, long_description: e.target.value }))}
                  placeholder="Detailed service description"
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-light">Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service_type">Service Type *</Label>
                <Select
                  value={formData.service_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="Icon name or URL"
                />
              </div>
            </CardContent>
          </Card>
        </div>

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
                  <Label htmlFor="gallery-file-upload" className={`cursor-pointer ${uploadingFiles ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                      id="gallery-file-upload"
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium text-zinc-900">Published</Label>
                <p className="text-sm text-zinc-700 font-medium">
                  Make this service visible on the website
                </p>
              </div>
              <Switch
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-zinc-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/services')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Service' : 'Create Service'}
          </Button>
        </div>
      </form>
    </div>
  )
}