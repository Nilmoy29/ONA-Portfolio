"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Building, 
  Calendar,
  DollarSign,
  Clock,
  Users
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

interface JobOpening {
  id: string
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
  created_at: string
  updated_at: string
}

export default function JobOpeningDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [jobOpening, setJobOpening] = useState<JobOpening | null>(null)
  const [loading, setLoading] = useState(true)

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
      setJobOpening(result.data)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to load job opening details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!jobOpening) return
    
    if (!confirm('Are you sure you want to delete this job opening?')) return

    try {
      const response = await fetch(`/api/admin/careers/${jobOpening.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete job opening')

      toast({
        title: "Success",
        description: "Job opening deleted successfully",
      })

      router.push('/admin/careers')
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to delete job opening",
        variant: "destructive",
      })
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

  if (!jobOpening) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Job opening not found</p>
            <Button asChild className="mt-4">
              <Link href="/admin/careers">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Careers
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/admin/careers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{jobOpening.title}</h1>
            <div className="flex items-center space-x-4 mt-2 text-muted-foreground">
              <div className="flex items-center">
                <Building className="mr-1 h-4 w-4" />
                {jobOpening.department}
              </div>
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                {jobOpening.location}
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {new Date(jobOpening.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/careers/${jobOpening.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex items-center space-x-2">
        <Badge variant={jobOpening.is_published ? "default" : "secondary"}>
          {jobOpening.is_published ? "Published" : "Draft"}
        </Badge>
        {jobOpening.is_featured && (
          <Badge variant="outline">Featured</Badge>
        )}
        <Badge variant="outline">{jobOpening.employment_type}</Badge>
        <Badge variant="outline">{jobOpening.experience_level}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{jobOpening.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>Key Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {jobOpening.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    {responsibility}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {jobOpening.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    {requirement}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Benefits */}
          {jobOpening.benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {jobOpening.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Salary Range</p>
                  <p className="font-medium">{jobOpening.salary_range || 'Not specified'}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Employment Type</p>
                  <p className="font-medium">{jobOpening.employment_type}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Experience Level</p>
                  <p className="font-medium">{jobOpening.experience_level}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Application Deadline</p>
                  <p className="font-medium">
                    {jobOpening.application_deadline 
                      ? new Date(jobOpening.application_deadline).toLocaleDateString()
                      : 'No deadline set'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-sm">{new Date(jobOpening.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm">{new Date(jobOpening.updated_at).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 