"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { ArrowLeft, Plus, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function NewJobOpeningPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    employment_type: 'full-time',
    experience_level: 'mid-level',
    description: '',
    salary_range: '',
    application_deadline: '',
    is_published: false,
    is_featured: false,
    sort_order: 0,
    posted_date: new Date().toISOString().split('T')[0]
  })

  const [requirements, setRequirements] = useState<string[]>([''])
  const [responsibilities, setResponsibilities] = useState<string[]>([''])
  const [benefits, setBenefits] = useState<string[]>([''])

  const departments = [
    'Architecture',
    'Interior Design', 
    'Project Management',
    'Engineering',
    'Business Development',
    'Administration'
  ]

  const employmentTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' }
  ]

  const experienceLevels = [
    { value: 'entry-level', label: 'Entry Level' },
    { value: 'mid-level', label: 'Mid Level' },
    { value: 'senior-level', label: 'Senior Level' },
    { value: 'lead', label: 'Lead' },
    { value: 'principal', label: 'Principal' }
  ]

  const handleArrayFieldChange = (
    index: number, 
    value: string, 
    array: string[], 
    setArray: (arr: string[]) => void
  ) => {
    const newArray = [...array]
    newArray[index] = value
    setArray(newArray)
  }

  const addArrayField = (array: string[], setArray: (arr: string[]) => void) => {
    setArray([...array, ''])
  }

  const removeArrayField = (index: number, array: string[], setArray: (arr: string[]) => void) => {
    if (array.length > 1) {
      setArray(array.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = {
        ...formData,
        requirements: requirements.filter(req => req.trim() !== ''),
        responsibilities: responsibilities.filter(resp => resp.trim() !== ''),
        benefits: benefits.filter(benefit => benefit.trim() !== ''),
        sort_order: parseInt(formData.sort_order.toString()) || 0
      }

      const response = await fetch('/api/admin/careers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Job opening created successfully"
        })
        router.push('/admin/careers')
      } else {
        throw new Error(data.error || 'Failed to create job opening')
      }
    } catch (error) {
      console.error('Error creating job:', error)
      toast({
        title: "Error",
        description: "Failed to create job opening",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/careers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Careers
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Create Job Opening</h1>
          <p className="text-sm text-gray-600 mt-1">
            Add a new career opportunity
          </p>
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
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Architect"
                  required
                />
              </div>
              <div>
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => handleSelectChange('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. New York, NY"
                  required
                />
              </div>
              <div>
                <Label htmlFor="employment_type">Employment Type</Label>
                <Select value={formData.employment_type} onValueChange={(value) => handleSelectChange('employment_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="experience_level">Experience Level</Label>
                <Select value={formData.experience_level} onValueChange={(value) => handleSelectChange('experience_level', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of the role..."
                rows={6}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={requirement}
                    onChange={(e) => handleArrayFieldChange(index, e.target.value, requirements, setRequirements)}
                    placeholder="Enter a requirement..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayField(index, requirements, setRequirements)}
                    disabled={requirements.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayField(requirements, setRequirements)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Requirement
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle>Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {responsibilities.map((responsibility, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={responsibility}
                    onChange={(e) => handleArrayFieldChange(index, e.target.value, responsibilities, setResponsibilities)}
                    placeholder="Enter a responsibility..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayField(index, responsibilities, setResponsibilities)}
                    disabled={responsibilities.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayField(responsibilities, setResponsibilities)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Responsibility
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={benefit}
                    onChange={(e) => handleArrayFieldChange(index, e.target.value, benefits, setBenefits)}
                    placeholder="Enter a benefit..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayField(index, benefits, setBenefits)}
                    disabled={benefits.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayField(benefits, setBenefits)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Benefit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary_range">Salary Range</Label>
                <Input
                  id="salary_range"
                  name="salary_range"
                  value={formData.salary_range}
                  onChange={handleChange}
                  placeholder="e.g. $80,000 - $120,000"
                />
              </div>
              <div>
                <Label htmlFor="application_deadline">Application Deadline</Label>
                <Input
                  id="application_deadline"
                  name="application_deadline"
                  type="date"
                  value={formData.application_deadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="posted_date">Posted Date</Label>
                <Input
                  id="posted_date"
                  name="posted_date"
                  type="date"
                  value={formData.posted_date}
                  onChange={handleChange}
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
                  min="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Publishing Options */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_published">Published</Label>
                <p className="text-sm text-gray-500">
                  Make this job opening visible to the public
                </p>
              </div>
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => handleSwitchChange('is_published', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_featured">Featured</Label>
                <p className="text-sm text-gray-500">
                  Highlight this job opening as featured
                </p>
              </div>
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => handleSwitchChange('is_featured', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/careers">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Job Opening'}
          </Button>
        </div>
      </form>
    </div>
  )
} 