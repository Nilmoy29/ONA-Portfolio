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
import { X, Upload, User } from 'lucide-react'
import { Project, Category } from '@/lib/database-types'
import { supabase } from '@/lib/supabase'
import { ImageUpload } from '@/components/admin/image-upload'

interface ProjectFormProps {
  project?: Project
  isEdit?: boolean
}

export function ProjectForm({ project, isEdit = false }: ProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  
  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    if (!project?.gallery_images) return []
    if (Array.isArray(project.gallery_images)) return project.gallery_images
    try {
      const parsed = typeof project.gallery_images === 'string' 
        ? JSON.parse(project.gallery_images) 
        : project.gallery_images
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  
  const [features, setFeatures] = useState<string[]>(() => {
    if (!(project as any)?.features) return []
    if (Array.isArray((project as any).features)) return (project as any).features
    try {
      const parsed = typeof (project as any).features === 'string' 
        ? JSON.parse((project as any).features) 
        : (project as any).features
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newFeature, setNewFeature] = useState('')
  const [uploadingFiles, setUploadingFiles] = useState(false)

  const [formData, setFormData] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    description: project?.description || '',
    content: project?.content || '',
    category_id: project?.category_id || '',
    featured_image_url: project?.featured_image_url || '',
    project_type: project?.project_type || '',
    client_name: project?.client_name || '',
    location: project?.location || '',
    completion_date: (project as any)?.completion_date || '',
    project_status: project?.project_status || 'planning',
    is_published: project?.is_published || false,
    sort_order: project?.sort_order || 0,
  })

  useEffect(() => {
    fetchCategories()
    fetchTeamMembers()
    fetchPartners()
    if (isEdit && project) {
      loadProjectTeamMembers()
    }
  }, [isEdit, project])

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })
      
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchTeamMembers = async () => {
    try {
      const { data } = await supabase
        .from('team_members')
        .select('id, name, position, profile_image_url')
        .eq('is_published', true)
        .order('name')
      
      setTeamMembers(data || [])
    } catch (error) {
      console.error('Error fetching team members:', error)
    }
  }

  const fetchPartners = async () => {
    try {
      const { data } = await supabase
        .from('partners')
        .select('id, name, logo_url')
        .eq('is_published', true)
        .order('name')
      
      setPartners(data || [])
    } catch (error) {
      console.error('Error fetching partners:', error)
    }
  }

  const loadProjectTeamMembers = async () => {
    if (!project?.id) return
    
    try {
      const { data } = await supabase
        .from('project_team_members')
        .select('team_member_id')
        .eq('project_id', project.id)
      
      setSelectedTeamMembers(data?.map(ptm => ptm.team_member_id) || [])
    } catch (error) {
      console.error('Error loading project team members:', error)
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
      setGalleryImages(prev => [...prev, newImageUrl.trim()])
      setNewImageUrl('')
    }
  }

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures(prev => [...prev, newFeature.trim()])
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index))
  }

  const toggleTeamMember = (memberId: string) => {
    setSelectedTeamMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('🚀 Starting project submission...')
    console.log('📝 Form data:', formData)
    console.log('🖼️ Gallery images:', galleryImages)

    try {
      // Clean the form data - remove empty strings and convert to null where appropriate
      const cleanFormData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        content: formData.content.trim() || null,
        category_id: formData.category_id || null,
        featured_image_url: formData.featured_image_url.trim() || null,
        project_type: formData.project_type.trim() || null,
        client_name: formData.client_name.trim() || null,
        location: formData.location.trim() || null,
        completion_date: formData.completion_date || null,
        project_status: formData.project_status || 'planning',
        is_published: Boolean(formData.is_published),
        sort_order: Number(formData.sort_order) || 0,
        gallery_images: galleryImages.filter(img => img.trim()),
        features: features.filter(feature => feature.trim())
      }

      console.log('📤 Cleaned data being submitted:', cleanFormData)
      console.log('👥 Selected team members:', selectedTeamMembers)

      // Validate required fields
      if (!cleanFormData.title || !cleanFormData.slug || !cleanFormData.description) {
        setError('Please fill in all required fields (Title, Slug, Description)')
        setLoading(false)
        return
      }

      const url = isEdit 
        ? `/api/admin/projects/${project?.id}`
        : '/api/admin/projects'
      
      const method = isEdit ? 'PUT' : 'POST'

      console.log(`📡 Making ${method} request to ${url}`)

      // Add timeout to prevent infinite loading
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const requestBody = {
        ...cleanFormData,
        team_member_ids: selectedTeamMembers.filter(id => id.trim())
      }
      
      console.log('📤 Request body:', JSON.stringify(requestBody, null, 2))
      console.log('👥 Selected team members (raw):', selectedTeamMembers)
      console.log('👥 Selected team members (filtered):', selectedTeamMembers.filter(id => id.trim()))

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      console.log('📥 Response status:', response.status)
      console.log('📥 Response ok:', response.ok)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Server error response:', errorData)
        setError(errorData.error || `Server error: ${response.status}`)
        return
      }

      const responseData = await response.json()
      console.log('📥 Success response data:', responseData)

      console.log('✅ Project saved successfully, redirecting...')
      router.push('/admin/projects')

    } catch (error) {
      console.error('❌ Submission error:', error)
      if (error instanceof Error && error.name === 'AbortError') {
        setError('Request timed out. Please try again.')
      } else {
        setError('Network error occurred. Please check your connection and try again.')
      }
    } finally {
      console.log('🏁 Submission complete, setting loading to false')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-light text-zinc-900">
          {isEdit ? 'Edit Project' : 'Create Project'}
        </h2>
        <p className="text-zinc-600">
          {isEdit ? 'Update project information' : 'Add a new architectural project'}
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
                  placeholder="Project title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="project-slug"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief project description"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Long Description</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Detailed project description"
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-light">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_type">Project Type</Label>
                <Input
                  id="project_type"
                  value={formData.project_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, project_type: e.target.value }))}
                  placeholder="e.g., Residential, Commercial"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_name">Client Name</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                  placeholder="Client or organization name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Project location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="completion_date">Completion Date</Label>
                <Input
                  id="completion_date"
                  type="date"
                  value={formData.completion_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, completion_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_status">Project Status</Label>
                <Select
                  value={formData.project_status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, project_status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="proposed">Proposed</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
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
                        setError('') // Clear any existing errors
                        
                        if (files.length === 0) return
                        
                        setUploadingFiles(true)
                        
                        // Track processing results
                        const results = {
                          successful: 0,
                          tooLarge: 0,
                          invalidType: 0,
                          failed: 0
                        }
                        
                        const processFile = (file: File) => {
                          return new Promise<string | null>((resolve) => {
                            // Skip invalid files but continue processing others
                            if (file.size > 15 * 1024 * 1024) {
                              console.warn(`Skipping ${file.name}: File too large (${(file.size / 1024 / 1024).toFixed(1)}MB)`)
                              results.tooLarge++
                              resolve(null)
                              return
                            }
                            
                            if (!file.type.startsWith('image/')) {
                              console.warn(`Skipping ${file.name}: Not an image file`)
                              results.invalidType++
                              resolve(null)
                              return
                            }

                            const reader = new FileReader()
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                const dataUrl = event.target.result as string
                                if (dataUrl.startsWith('data:image/') && dataUrl.length < 7000000) {
                                  console.log(`Processed ${file.name} successfully`)
                                  results.successful++
                                  resolve(dataUrl)
                                } else {
                                  console.warn(`Skipping ${file.name}: Invalid format or too large after encoding`)
                                  results.failed++
                                  resolve(null)
                                }
                              } else {
                                results.failed++
                                resolve(null)
                              }
                            }
                            reader.onerror = () => {
                              console.warn(`Error reading ${file.name}`)
                              results.failed++
                              resolve(null)
                            }
                            reader.readAsDataURL(file)
                          })
                        }
                        
                        try {
                          // Process all files
                          const imageResults = await Promise.all(files.map(processFile))
                          const validDataUrls = imageResults.filter((url): url is string => url !== null)
                          
                          if (validDataUrls.length > 0) {
                            setGalleryImages(prev => {
                              const newImages = [...prev, ...validDataUrls]
                              console.log(`Added ${validDataUrls.length} images to gallery. Total images: ${newImages.length}`)
                              return newImages
                            })
                          }
                          
                          // Show summary message
                          if (results.successful > 0) {
                            console.log(`Successfully uploaded ${results.successful} image(s)`)
                          }
                          
                          if (results.tooLarge > 0 || results.invalidType > 0 || results.failed > 0) {
                            const errorParts: string[] = []
                            if (results.tooLarge > 0) errorParts.push(`${results.tooLarge} file(s) too large (max 15MB)`)
                            if (results.invalidType > 0) errorParts.push(`${results.invalidType} file(s) not images`)
                            if (results.failed > 0) errorParts.push(`${results.failed} file(s) failed to process`)
                            
                            setError(`Some files were skipped: ${errorParts.join(', ')}`)
                          }
                          
                        } catch (error) {
                          console.error('Error processing files:', error)
                          setError('Failed to process some files. Please try again.')
                        } finally {
                          setUploadingFiles(false)
                          
                          // Reset file input to allow selecting the same files again
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

        {/* Key Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light">Key Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newFeature">Add Feature</Label>
              <div className="flex gap-2">
                <Input
                  id="newFeature"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Enter a key feature"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button 
                  type="button" 
                  onClick={addFeature}
                  disabled={!newFeature.trim()}
                  size="sm"
                >
                  Add
                </Button>
              </div>
            </div>

            {features.length > 0 && (
              <div className="space-y-2">
                <Label>Current Features</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-zinc-50 rounded">
                      <span className="flex-1 text-sm">{feature}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light">Project Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Team Members</Label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 border rounded">
                    <input
                      type="checkbox"
                      id={`team-${member.id}`}
                      checked={selectedTeamMembers.includes(member.id)}
                      onChange={() => toggleTeamMember(member.id)}
                      className="rounded"
                    />
                    <div className="flex items-center gap-2 flex-1">
                      {member.profile_image_url ? (
                        <img 
                          src={member.profile_image_url} 
                          alt={member.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-zinc-500" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium">{member.name}</div>
                        <div className="text-xs text-zinc-500">{member.position || 'Team Member'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {selectedTeamMembers.length > 0 && (
                <div className="text-sm text-zinc-600">
                  {selectedTeamMembers.length} team member(s) selected
                </div>
              )}
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
                  Make this project visible on the website
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
              <p className="text-xs text-zinc-500">
                Lower numbers appear first. Use increments of 10 (e.g., 10, 20, 30) to leave room for reordering.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/projects')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </div>
  )
}