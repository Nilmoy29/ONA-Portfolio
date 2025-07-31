"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { 
  ArrowLeft, 
  MapPin, 
  Building, 
  Calendar, 
  DollarSign, 
  Clock, 
  Users, 
  CheckCircle,
  ArrowRight,
  Mail,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface JobOpening {
  id: string
  title: string
  slug: string
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
  application_email: string
  application_url: string
  is_featured: boolean
  created_at: string
}

export default function CareerDetailPage() {
  const params = useParams()
  const [jobOpening, setJobOpening] = useState<JobOpening | null>(null)
  const [relatedJobs, setRelatedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.slug) {
      fetchJobOpening()
      fetchRelatedJobs()
    }
  }, [params.slug])

  const fetchJobOpening = async () => {
    try {
      const response = await fetch(`/api/public/careers/${params.slug}`)
      const data = await response.json()
      setJobOpening(data.data)
    } catch (error) {
      console.error('Error fetching job opening:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedJobs = async () => {
    try {
      const response = await fetch('/api/public/careers?limit=3')
      const data = await response.json()
      setRelatedJobs(data.data || [])
    } catch (error) {
      console.error('Error fetching related jobs:', error)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getEmploymentTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'full-time': return 'bg-green-100 text-green-800'
      case 'part-time': return 'bg-blue-100 text-blue-800'
      case 'contract': return 'bg-purple-100 text-purple-800'
      case 'internship': return 'bg-orange-100 text-orange-800'
      case 'freelance': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getExperienceLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'entry-level': return 'bg-emerald-100 text-emerald-800'
      case 'mid-level': return 'bg-blue-100 text-blue-800'
      case 'senior-level': return 'bg-indigo-100 text-indigo-800'
      case 'executive': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 pb-20 px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-16 bg-zinc-200 rounded mb-6"></div>
              <div className="h-8 bg-zinc-200 rounded mb-4"></div>
              <div className="h-64 bg-zinc-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!jobOpening) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 pb-20 px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl font-light mb-4">Job Opening Not Found</h1>
            <p className="text-zinc-600 mb-8">The position you're looking for doesn't exist or is no longer available.</p>
            <Link href="/careers">
              <button className="flex items-center space-x-2 text-lg font-light uppercase tracking-wider border-b border-black pb-2 hover:text-zinc-600 hover:border-zinc-600 transition-colors mx-auto">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Careers</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8">
        <motion.div 
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Back Button */}
          <motion.div variants={itemVariants} className="mb-8">
            <Link href="/careers">
              <button className="flex items-center space-x-2 text-lg font-light uppercase tracking-wider border-b border-black pb-2 hover:text-zinc-600 hover:border-zinc-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>All Careers</span>
              </button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-2 space-y-8"
            >
              {/* Header */}
              <div>
                <div className="flex flex-wrap gap-3 mb-6">
                  {jobOpening.is_featured && (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                      Featured
                    </Badge>
                  )}
                  <Badge className={getEmploymentTypeColor(jobOpening.employment_type)}>
                    {jobOpening.employment_type}
                  </Badge>
                  <Badge className={getExperienceLevelColor(jobOpening.experience_level)}>
                    {jobOpening.experience_level}
                  </Badge>
                </div>

                <h1 className="text-4xl lg:text-5xl font-light mb-4">{jobOpening.title}</h1>
                
                <div className="flex flex-wrap items-center gap-6 text-zinc-600">
                  <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>{jobOpening.department}</span>
                  </div>
                  {jobOpening.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5" />
                      <span>{jobOpening.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Posted {formatDate(jobOpening.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-light">About This Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-lg text-zinc-600 font-light leading-relaxed whitespace-pre-wrap">
                      {jobOpening.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Responsibilities */}
              {jobOpening.responsibilities && jobOpening.responsibilities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-light">Key Responsibilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {jobOpening.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-lg text-zinc-600 font-light leading-relaxed">
                            {responsibility}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Requirements */}
              {jobOpening.requirements && jobOpening.requirements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-light">Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {jobOpening.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                          <span className="text-lg text-zinc-600 font-light leading-relaxed">
                            {requirement}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Benefits */}
              {jobOpening.benefits && jobOpening.benefits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-light">What We Offer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {jobOpening.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                          <span className="text-lg text-zinc-600 font-light leading-relaxed">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div 
              variants={itemVariants}
              className="space-y-6"
            >
              {/* Application Card */}
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-xl font-light">Apply for This Position</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Job Details */}
                  <div className="space-y-4">
                    {jobOpening.salary_range && (
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-5 w-5 text-zinc-400" />
                        <div>
                          <p className="text-sm text-zinc-500">Salary Range</p>
                          <p className="font-medium">{jobOpening.salary_range}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-zinc-400" />
                      <div>
                        <p className="text-sm text-zinc-500">Employment Type</p>
                        <p className="font-medium">{jobOpening.employment_type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-zinc-400" />
                      <div>
                        <p className="text-sm text-zinc-500">Experience Level</p>
                        <p className="font-medium">{jobOpening.experience_level}</p>
                      </div>
                    </div>

                    {jobOpening.application_deadline && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-zinc-400" />
                        <div>
                          <p className="text-sm text-zinc-500">Application Deadline</p>
                          <p className="font-medium">{formatDate(jobOpening.application_deadline)}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Application Actions */}
                  <div className="pt-4 border-t space-y-3">
                    {jobOpening.application_url ? (
                      <Button asChild className="w-full">
                        <a href={jobOpening.application_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Apply Online
                        </a>
                      </Button>
                    ) : jobOpening.application_email ? (
                      <Button asChild className="w-full">
                        <a href={`mailto:${jobOpening.application_email}?subject=Application for ${jobOpening.title}`}>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Application
                        </a>
                      </Button>
                    ) : (
                      <Button asChild className="w-full">
                        <a href="mailto:careers@company.com?subject=Application for ${jobOpening.title}">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Application
                        </a>
                      </Button>
                    )}
                    
                    <Button variant="outline" className="w-full">
                      Share Position
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Company Culture Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-light">Why Join Us?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 text-sm leading-relaxed">
                    We're building the future of architecture and design. Join our team of passionate creators 
                    who are committed to excellence, innovation, and making a positive impact on the world.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Related Jobs Section */}
      {relatedJobs.length > 0 && (
        <section className="py-20 px-6 lg:px-8 bg-zinc-50">
          <motion.div 
            className="max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-light mb-4">Other Opportunities</h2>
              <p className="text-xl text-zinc-600 font-light">
                Explore more ways to join our team
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedJobs.slice(0, 3).map((job: any, index: number) => (
                <motion.div
                  key={job.id}
                  variants={itemVariants}
                  className="group"
                >
                  <Link href={`/careers/${job.slug}`}>
                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
                      <CardContent className="p-8">
                        <div className="mb-4">
                          <Badge className={getEmploymentTypeColor(job.employment_type)}>
                            {job.employment_type}
                          </Badge>
                        </div>
                        
                        <h3 className="text-xl font-light mb-3 group-hover:text-zinc-600 transition-colors">
                          {job.title}
                        </h3>
                        
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center space-x-2 text-sm text-zinc-500">
                            <Building className="h-4 w-4" />
                            <span>{job.department}</span>
                          </div>
                          {job.location && (
                            <div className="flex items-center space-x-2 text-sm text-zinc-500">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-zinc-400 group-hover:text-zinc-600 transition-colors">
                          <span>Learn More</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}
    </div>
  )
} 