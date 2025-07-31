"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Eye,
  MoreHorizontal,
  Building,
  MapPin,
  Calendar,
  DollarSign
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

interface JobOpening {
  id: string
  title: string
  slug: string
  department: string
  location: string
  employment_type: string
  experience_level: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  salary_range: string | null
  application_deadline: string | null
  is_published: boolean
  is_featured: boolean
  sort_order: number
  posted_date: string
  created_at: string
  updated_at: string
}

export default function CareersAdminPage() {
  const [jobs, setJobs] = useState<JobOpening[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  const departments = [
    'Architecture',
    'Interior Design',
    'Project Management',
    'Engineering',
    'Business Development',
    'Administration'
  ]

  useEffect(() => {
    fetchJobs()
  }, [searchTerm, selectedDepartment, selectedStatus, page])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedDepartment && { department: selectedDepartment }),
        ...(selectedStatus && { status: selectedStatus })
      })

      const response = await fetch(`/api/admin/careers?${params}`)
      const data = await response.json()

      if (response.ok) {
        setJobs(data.data || [])
        setTotalPages(data.pagination?.totalPages || 1)
      } else {
        throw new Error(data.error || 'Failed to fetch jobs')
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast({
        title: "Error",
        description: "Failed to fetch job openings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job opening?')) return

    try {
      const response = await fetch(`/api/admin/careers/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Job opening deleted successfully"
        })
        fetchJobs()
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete job opening')
      }
    } catch (error) {
      console.error('Error deleting job:', error)
      toast({
        title: "Error",
        description: "Failed to delete job opening",
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (isPublished: boolean, isFeatured: boolean) => {
    if (!isPublished) return 'bg-gray-100 text-gray-800'
    if (isFeatured) return 'bg-green-100 text-green-800'
    return 'bg-blue-100 text-blue-800'
  }

  const getStatusLabel = (isPublished: boolean, isFeatured: boolean) => {
    if (!isPublished) return 'Draft'
    if (isFeatured) return 'Featured'
    return 'Published'
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'full-time': return 'bg-green-100 text-green-800'
      case 'part-time': return 'bg-blue-100 text-blue-800'
      case 'contract': return 'bg-purple-100 text-purple-800'
      case 'internship': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Career Opportunities</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage job openings and career opportunities
          </p>
        </div>
        <Link href="/admin/careers/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Job Opening
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search job openings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Job Openings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Job Openings ({jobs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading job openings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No job openings found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first job opening.</p>
              <Link href="/admin/careers/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Job Opening
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Posted Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{job.title}</div>
                          <div className="text-sm text-gray-500">{job.experience_level}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{job.department}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-3 w-3 mr-1" />
                          {job.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(job.employment_type)}>
                          {job.employment_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(job.is_published, job.is_featured)}>
                          {getStatusLabel(job.is_published, job.is_featured)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(job.posted_date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/careers/${job.slug}`} target="_blank">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/careers/${job.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDelete(job.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 