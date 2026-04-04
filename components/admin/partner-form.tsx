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
import { X, Upload, Building } from 'lucide-react'
import { Partner } from '@/lib/database-types'
import { ImageUpload } from '@/components/admin/image-upload'

interface PartnerFormProps {
  partner?: Partner
  isEdit?: boolean
}

export function PartnerForm({ partner, isEdit = false }: PartnerFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: partner?.name || '',
    slug: partner?.slug || '',
    description: partner?.description || '',
    website_url: partner?.website_url || '',
    logo_url: partner?.logo_url || '',
    partnership_type: partner?.partnership_type || '',
    location: partner?.location || '',
    established_year: partner?.established_year || '',
    is_published: partner?.is_published ?? true,
    sort_order: partner?.sort_order || 0,
  })

  useEffect(() => {
    if (formData.name && !isEdit) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.name, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const dataToSubmit = {
        ...formData,
        sort_order: parseInt(formData.sort_order.toString()) || 0,
        established_year: formData.established_year ? parseInt(formData.established_year.toString()) || null : null,
      }

      const url = isEdit ? `/api/admin/partners/${partner?.id}` : '/api/admin/partners'
      const method = isEdit ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        credentials: 'include', // Important for session cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to login if unauthorized
          window.location.href = '/admin/login'
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save partner')
      }

      router.push('/admin/partners')
      router.refresh()
    } catch (err) {
      console.error('Form submission error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-light">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Partner Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter partner name"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="partner-name-slug"
                disabled={isEdit}
              />
              {isEdit && (
                <p className="text-sm text-zinc-500 mt-1">Slug cannot be changed after creation</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the partner"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="partnership_type">Partnership Type</Label>
              <Select 
                value={formData.partnership_type || 'none'} 
                onValueChange={(value) => handleSelectChange('partnership_type', value === 'none' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select partnership type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                  <SelectItem value="consultant">Consultant</SelectItem>
                  <SelectItem value="investor">Investor</SelectItem>
                  <SelectItem value="sponsor">Sponsor</SelectItem>
                  <SelectItem value="strategic">Strategic Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="established_year">Established Year</Label>
              <Input
                id="established_year"
                name="established_year"
                type="number"
                min="1800"
                max="2024"
                value={formData.established_year}
                onChange={handleChange}
                placeholder="e.g., 1995"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, State/Country"
            />
          </div>

          <div>
            <Label htmlFor="website_url">Website URL</Label>
            <Input
              id="website_url"
              name="website_url"
              type="url"
              value={formData.website_url}
              onChange={handleChange}
              placeholder="https://partner.com"
            />
          </div>

          <div>
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              name="logo_url"
              type="url"
              value={formData.logo_url}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
            />
            {formData.logo_url && (
              <div className="mt-2">
                <img 
                  src={formData.logo_url} 
                  alt="Logo preview" 
                  className="w-20 h-20 object-contain border rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
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
            <div>
              <Label htmlFor="is_published">Published</Label>
              <p className="text-sm text-zinc-600">Make this partner visible on the website</p>
            </div>
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => handleSwitchChange('is_published', checked)}
            />
          </div>

          <div>
            <Label htmlFor="sort_order">Sort Order</Label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={handleChange}
              placeholder="0"
            />
            <p className="text-sm text-zinc-600">Lower numbers appear first in listings</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/partners')}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            isEdit ? 'Update Partner' : 'Create Partner'
          )}
        </Button>
      </div>
    </form>
  )
}