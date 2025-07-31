"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface JobOpeningFormData {
  title: string
  department: string
  location: string
  employment_type: string
  experience_level: string
  salary_range: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  application_deadline: string
  is_published: boolean
  is_featured: boolean
}

export default function EditJobOpeningPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<JobOpeningFormData>({
    title: '',
    department: '',
    location: '',
    employment_type: '',
    experience_level: '',
    salary_range: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    benefits: [''],
    application_deadline: '',
    is_published: false,
    is_featured: false,
  })

  useEffect(() => {
    if (params.id) {
      fetchJobOpening(params.id as string)
    }
  }, [params.id])

  const fetchJobOpening = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/careers/${id}`)
      if (!response.ok) throw new Error('Failed to fetch job opening')
      
      const result = await response.json()
      const jobOpening = result.data
      
      setFormData({
        title: jobOpening.title || '',
        department: jobOpening.department || '',
        location: jobOpening.location || '',
        employment_type: jobOpening.employment_type || '',
        experience_level: jobOpening.experience_level || '',
        salary_range: jobOpening.salary_range || '',
        description: jobOpening.description || '',
        requirements: jobOpening.requirements || [''],
        responsibilities: jobOpening.responsibilities || [''],
        benefits: jobOpening.benefits || [''],
        application_deadline: jobOpening.application_deadline ? 
          new Date(jobOpening.application_deadline).toISOString().split('T')[0] : '',
        is_published: jobOpening.is_published || false,
        is_featured: jobOpening.is_featured || false,
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to load job opening",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof JobOpeningFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field: 'requirements' | 'responsibilities' | 'benefits', index: number, value: string) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }))
  }

  const addArrayItem = (field: 'requirements' | 'responsibilities' | 'benefits') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field: 'requirements' | 'responsibilities' | 'benefits', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      [field]: newArray.length > 0 ? newArray : ['']
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!params.id) return

    // Validation
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Job title is required",
        variant: "destructive",
      })
      return
    }

    if (!formData.department.trim()) {
      toast({
        title: "Validation Error", 
        description: "Department is required",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      // Clean up arrays by removing empty strings
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter(item => item.trim() !== ''),
        responsibilities: formData.responsibilities.filter(item => item.trim() !== ''),
        benefits: formData.benefits.filter(item => item.trim() !== ''),
      }

      const response = await fetch(`/api/admin/careers/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      })

      if (!response.ok) {
        throw new Error('Failed to update job opening')
      }

      toast({
        title: "Success",
        description: "Job opening updated successfully",
      })

      router.push(`/admin/careers/${params.id}`)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to update job opening",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href={`/admin/careers/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit Job Opening</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Remote, New York, NY"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employment_type">Employment Type</Label>
                <Select value={formData.employment_type} onValueChange={(value) => handleInputChange('employment_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience_level">Experience Level</Label>
                <Select value={formData.experience_level} onValueChange={(value) => handleInputChange('experience_level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry-level">Entry Level</SelectItem>
                    <SelectItem value="mid-level">Mid Level</SelectItem>
                    <SelectItem value="senior-level">Senior Level</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary_range">Salary Range</Label>
                <Input
                  id="salary_range"
                  value={formData.salary_range}
                  onChange={(e) => handleInputChange('salary_range', e.target.value)}
                  placeholder="e.g., $80,000 - $120,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="application_deadline">Application Deadline</Label>
                <Input
                  id="application_deadline"
                  type="date"
                  value={formData.application_deadline}
                  onChange={(e) => handleInputChange('application_deadline', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                placeholder="Provide a detailed description of the role..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle>Key Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.responsibilities.map((responsibility, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={responsibility}
                  onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                  placeholder="Enter a key responsibility..."
                  rows={2}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem('responsibilities', index)}
                  disabled={formData.responsibilities.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('responsibilities')}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Responsibility
            </Button>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={requirement}
                  onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                  placeholder="Enter a requirement..."
                  rows={2}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem('requirements', index)}
                  disabled={formData.requirements.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('requirements')}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Requirement
            </Button>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Benefits (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={benefit}
                  onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                  placeholder="Enter a benefit..."
                  rows={2}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem('benefits', index)}
                  disabled={formData.benefits.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('benefits')}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Benefit
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Published</Label>
                <div className="text-sm text-muted-foreground">
                  Make this job opening visible to the public
                </div>
              </div>
              <Switch
                checked={formData.is_published}
                onCheckedChange={(checked) => handleInputChange('is_published', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Featured</Label>
                <div className="text-sm text-muted-foreground">
                  Highlight this job opening on the careers page
                </div>
              </div>
              <Switch
                checked={formData.is_featured}
                onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" asChild>
            <Link href={`/admin/careers/${params.id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Job Opening
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 