"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X } from 'lucide-react'
import { TeamMember } from '@/lib/database-types'
import { ImageUpload } from '@/components/admin/image-upload'

interface TeamMemberFormProps {
  teamMember?: TeamMember
  isEdit?: boolean
}

export function TeamMemberForm({ teamMember, isEdit = false }: TeamMemberFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [specializations, setSpecializations] = useState<string[]>(
    (teamMember?.specializations as string[]) || []
  )
  const [certifications, setCertifications] = useState<string[]>(
    (teamMember?.certifications as string[]) || []
  )
  const [newSpecialization, setNewSpecialization] = useState('')
  const [newCertification, setNewCertification] = useState('')

  const [formData, setFormData] = useState({
    name: teamMember?.name || '',
    slug: teamMember?.slug || '',
    position: teamMember?.position || '',
    bio: teamMember?.bio || '',
    long_bio: teamMember?.long_bio || '',
    profile_image_url: teamMember?.profile_image_url || '',
    email: teamMember?.email || '',
    phone: teamMember?.phone || '',
    linkedin_url: teamMember?.linkedin_url || '',
    twitter_url: teamMember?.twitter_url || '',
    portfolio_url: teamMember?.portfolio_url || '',
    education: teamMember?.education || '',
    experience_years: teamMember?.experience_years || 0,
    is_published: teamMember?.is_published || false,
    sort_order: teamMember?.sort_order || 0,
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

  const addSpecialization = () => {
    if (newSpecialization.trim() && !specializations.includes(newSpecialization.trim())) {
      setSpecializations([...specializations, newSpecialization.trim()])
      setNewSpecialization('')
    }
  }

  const removeSpecialization = (index: number) => {
    setSpecializations(specializations.filter((_, i) => i !== index))
  }

  const addCertification = () => {
    if (newCertification.trim() && !certifications.includes(newCertification.trim())) {
      setCertifications([...certifications, newCertification.trim()])
      setNewCertification('')
    }
  }

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const submitData = {
        ...formData,
        specializations,
        certifications,
        experience_years: formData.experience_years || null,
      }

      const url = isEdit 
        ? `/api/admin/team/${teamMember?.id}`
        : '/api/admin/team'
      
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
        router.push('/admin/team')
      } else {
        setError(data.error || 'Failed to save team member')
      }
    } catch (error) {
      console.error('Error saving team member:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-light text-zinc-900">
          {isEdit ? 'Edit Team Member' : 'Add Team Member'}
        </h2>
        <p className="text-zinc-600">
          {isEdit ? 'Update team member information' : 'Add a new team member to the roster'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="contact">Contact & Social</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-light">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="first-last-name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      placeholder="Job title or role"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Short Biography</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Brief professional summary (2-3 lines)"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-light">Detailed Biography</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="long_bio">Detailed Biography</Label>
                    <Textarea
                      id="long_bio"
                      value={formData.long_bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, long_bio: e.target.value }))}
                      placeholder="Comprehensive professional background, achievements, and expertise"
                      rows={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <ImageUpload
                      value={formData.profile_image_url}
                      onChange={(url) => setFormData(prev => ({ ...prev, profile_image_url: url }))}
                      label="Profile Image"
                      placeholder="https://example.com/profile.jpg"
                      uploadToStorage
                      storageFolder="team"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="professional" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-light">Professional Background</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    <Textarea
                      id="education"
                      value={formData.education}
                      onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                      placeholder="Educational background, degrees, institutions"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience_years">Years of Experience</Label>
                    <Input
                      id="experience_years"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.experience_years}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                      placeholder="Years of professional experience"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-light">Skills & Certifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Specializations</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newSpecialization}
                        onChange={(e) => setNewSpecialization(e.target.value)}
                        placeholder="Add specialization"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                      />
                      <Button type="button" onClick={addSpecialization}>
                        Add
                      </Button>
                    </div>
                    {specializations.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {specializations.map((spec, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {spec}
                            <button
                              type="button"
                              onClick={() => removeSpecialization(index)}
                              className="ml-1 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Certifications</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        placeholder="Add certification"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                      />
                      <Button type="button" onClick={addCertification}>
                        Add
                      </Button>
                    </div>
                    {certifications.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {certifications.map((cert, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            {cert}
                            <button
                              type="button"
                              onClick={() => removeCertification(index)}
                              className="ml-1 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-light">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Phone number"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-light">Social & Professional Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input
                      id="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter_url">Twitter URL</Label>
                    <Input
                      id="twitter_url"
                      value={formData.twitter_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, twitter_url: e.target.value }))}
                      placeholder="https://twitter.com/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolio_url">Portfolio URL</Label>
                    <Input
                      id="portfolio_url"
                      value={formData.portfolio_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                      placeholder="https://portfolio.example.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light">Publishing Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium text-zinc-900">Published</Label>
                <p className="text-sm text-zinc-700 font-medium">
                  Make this team member visible on the website
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
              <p className="text-sm text-zinc-600">Lower numbers appear first in listings</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/team')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Team Member' : 'Add Team Member'}
          </Button>
        </div>
      </form>
    </div>
  )
}