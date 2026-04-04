"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft, 
  Edit, 
  ExternalLink, 
  MapPin, 
  Calendar,
  User,
  Building,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react'
import { Project } from '@/lib/database-types'

interface ProjectWithRelations extends Project {
  categories?: {
    id: string
    name: string
    slug: string
    color: string | null
  }
  project_partners?: Array<{
    partners: {
      id: string
      name: string
      slug: string
      logo_url: string | null
    }
  }>
  project_team_members?: Array<{
    team_members: {
      id: string
      name: string
      slug: string
      position: string | null
    }
  }>
}

export default function ProjectDetailPage() {
  const params = useParams()
  const [project, setProject] = useState<ProjectWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string)
    }
  }, [params.id])

  const fetchProject = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/projects/${id}`)
      const data = await response.json()

      if (response.ok && data.data) {
        setProject(data.data)
      } else {
        setError(data.error || 'Failed to fetch project')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'planning': return 'bg-yellow-100 text-yellow-800'
      case 'on_hold': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2 text-zinc-500">Loading project...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error || 'Project not found'}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-light text-zinc-900">{project.title}</h1>
            <p className="text-zinc-600">Project Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={project.is_published ? 'default' : 'secondary'}>
            {project.is_published ? (
              <>
                <Eye className="h-3 w-3 mr-1" />
                Published
              </>
            ) : (
              <>
                <EyeOff className="h-3 w-3 mr-1" />
                Draft
              </>
            )}
          </Badge>
          <Button asChild>
            <Link href={`/admin/projects/${project.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          {project.featured_image_url && (
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={project.featured_image_url}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {project.description ? (
                  <p className="text-zinc-700 whitespace-pre-wrap">{project.description}</p>
                ) : (
                  <p className="text-zinc-500 italic">No description provided</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Gallery */}
          {project.gallery_images && project.gallery_images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Project Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(project.gallery_images as string[]).map((imageUrl, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={`${project.title} - Image ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-500">Status</label>
                <div className="mt-1">
                  <Badge className={getStatusColor(project.project_status || 'planning')}>
                    {formatStatus(project.project_status || 'planning')}
                  </Badge>
                </div>
              </div>

              {project.categories && (
                <div>
                  <label className="text-sm font-medium text-zinc-500">Category</label>
                  <div className="mt-1">
                    <Badge 
                      variant="outline"
                      style={{ 
                        backgroundColor: project.categories.color || undefined,
                        color: project.categories.color ? 'white' : undefined 
                      }}
                    >
                      {project.categories.name}
                    </Badge>
                  </div>
                </div>
              )}

              {project.client_name && (
                <div>
                  <label className="text-sm font-medium text-zinc-500">Client</label>
                  <div className="mt-1 flex items-center gap-2">
                    <User className="h-4 w-4 text-zinc-400" />
                    <span className="text-sm">{project.client_name}</span>
                  </div>
                </div>
              )}

              {project.location && (
                <div>
                  <label className="text-sm font-medium text-zinc-500">Location</label>
                  <div className="mt-1 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-zinc-400" />
                    <span className="text-sm">{project.location}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-zinc-500">Sort Order</label>
                <div className="mt-1">
                  <span className="text-sm">{project.sort_order || 0}</span>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-zinc-500">Created</label>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm">{new Date(project.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-500">Last Updated</label>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm">{new Date(project.updated_at).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partners */}
          {project.project_partners && project.project_partners.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Project Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.project_partners.map((partnerRelation, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {partnerRelation.partners.logo_url ? (
                        <Image
                          src={partnerRelation.partners.logo_url}
                          alt={partnerRelation.partners.name}
                          width={32}
                          height={32}
                          className="rounded"
                        />
                      ) : (
                        <Building className="h-8 w-8 text-zinc-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{partnerRelation.partners.name}</p>
                        <p className="text-xs text-zinc-500">{partnerRelation.partners.slug}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Team Members */}
          {project.project_team_members && project.project_team_members.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.project_team_members.map((memberRelation, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{memberRelation.team_members.name}</p>
                        <p className="text-xs text-zinc-500">
                          {memberRelation.team_members.position || 'Team Member'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}