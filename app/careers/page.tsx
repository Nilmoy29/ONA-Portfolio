"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  MapPin, 
  Clock, 
  Briefcase,
  Users,
  ArrowRight,
  Mail,
  Search,
  Filter,
  Star,
  DollarSign,
  Calendar
} from 'lucide-react'

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
  is_featured: boolean
  posted_date: string
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobOpening[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [searchTerm, selectedDepartment, selectedType, selectedLocation])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (selectedDepartment) params.append('department', selectedDepartment)
      if (selectedType) params.append('type', selectedType)
      if (selectedLocation) params.append('location', selectedLocation)
      
      const response = await fetch(`/api/public/careers?${params.toString()}`)
      const data = await response.json()
      
      let filteredJobs = data.data || []
      
      // Apply client-side search filter
      if (searchTerm) {
        filteredJobs = filteredJobs.filter((job: JobOpening) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.department.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      setJobs(filteredJobs)
    } catch (error) {
      console.error('Error fetching jobs:', error)
      setJobs([])
    } finally {
      setLoading(false)
    }
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

  const formatEmploymentType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const formatExperienceLevel = (level: string) => {
    return level.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isDeadlineSoon = (deadline: string | null) => {
    if (!deadline) return false
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  }

  // Get unique values for filters
  const departments = [...new Set(jobs.map(job => job.department))]
  const employmentTypes = [...new Set(jobs.map(job => job.employment_type))]
  const locations = [...new Set(jobs.map(job => job.location))]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-zinc-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-light text-zinc-900 mb-6">
              Join Our <span className="italic font-extralight">Team</span>
            </h1>
            <p className="text-xl text-zinc-600 font-light leading-relaxed max-w-3xl mx-auto">
              Build the future of architecture with us. We're looking for passionate individuals 
              who share our commitment to indigenous design principles and sustainable innovation.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search positions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {employmentTypes.map(type => (
                    <SelectItem key={type} value={type}>{formatEmploymentType(type)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-zinc-200 rounded mb-2"></div>
                  <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-zinc-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="h-16 w-16 text-zinc-400 mx-auto mb-6" />
            <h3 className="text-2xl font-light text-zinc-900 mb-4">No positions found</h3>
            <p className="text-zinc-600">
              We don't have any open positions matching your criteria at the moment. 
              Check back soon or send us your resume for future opportunities.
            </p>
            <Button className="mt-6">
              <Mail className="h-4 w-4 mr-2" />
              Send Resume
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl font-medium group-hover:text-zinc-600 transition-colors">
                          {job.title}
                        </CardTitle>
                        {job.is_featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getTypeColor(job.employment_type)}>
                          {formatEmploymentType(job.employment_type)}
                        </Badge>
                        <Badge variant="outline">
                          {formatExperienceLevel(job.experience_level)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-zinc-600">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {job.department}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(job.posted_date)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-zinc-700 mb-4 line-clamp-3">
                    {job.description}
                  </p>
                  
                  {job.salary_range && (
                    <div className="flex items-center gap-1 text-sm text-zinc-600 mb-3">
                      <DollarSign className="h-4 w-4" />
                      {job.salary_range}
                    </div>
                  )}
                  
                  {job.application_deadline && (
                    <div className="flex items-center gap-1 text-sm mb-4">
                      <Calendar className="h-4 w-4" />
                      <span className={isDeadlineSoon(job.application_deadline) ? 'text-red-600 font-medium' : 'text-zinc-600'}>
                        Apply by {formatDate(job.application_deadline)}
                        {isDeadlineSoon(job.application_deadline) && ' (Soon!)'}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-zinc-500">
                      {job.requirements.length} requirements
                    </div>
                    <Button variant="outline" size="sm" className="group">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-20 bg-zinc-900 rounded-lg p-12 text-center text-white">
          <h3 className="text-3xl font-light mb-6">
            Don't See the Right <span className="italic font-extralight">Fit</span>?
          </h3>
          <p className="text-xl text-zinc-300 font-light leading-relaxed max-w-3xl mx-auto mb-8">
            We're always looking for talented individuals who share our passion for 
            indigenous architecture and sustainable design. Send us your portfolio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-zinc-900">
              <Mail className="h-4 w-4 mr-2" />
              Send Portfolio
            </Button>
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-zinc-900">
              <Users className="h-4 w-4 mr-2" />
              Learn About Our Culture
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}