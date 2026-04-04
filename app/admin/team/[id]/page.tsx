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
  Mail,
  Phone,
  Calendar,
  User,
  Loader2,
  Eye,
  EyeOff,
  ExternalLink
} from 'lucide-react'
import { TeamMember } from '@/lib/database-types'

interface TeamMemberWithProjects extends TeamMember {
  project_team_members?: Array<{
    projects: {
      id: string
      title: string
      slug: string
      featured_image_url: string | null
    }
  }>
}

export default function TeamMemberDetailPage() {
  const params = useParams()
  const [teamMember, setTeamMember] = useState<TeamMemberWithProjects | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchTeamMember(params.id as string)
    }
  }, [params.id])

  const fetchTeamMember = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/team/${id}`)
      const data = await response.json()

      if (response.ok && data.data) {
        setTeamMember(data.data)
      } else {
        setError(data.error || 'Failed to fetch team member')
      }
    } catch (error) {
      console.error('Error fetching team member:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/team">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Team
            </Link>
          </Button>
        </div>
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2 text-zinc-500">Loading team member...</p>
        </div>
      </div>
    )
  }

  if (error || !teamMember) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/team">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Team
            </Link>
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error || 'Team member not found'}</AlertDescription>
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
            <Link href="/admin/team">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Team
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-light text-zinc-900">{teamMember.name}</h1>
            <p className="text-zinc-600">{teamMember.position || 'Team Member'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={teamMember.is_published ? 'default' : 'secondary'}>
            {teamMember.is_published ? (
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
            <Link href={`/admin/team/${teamMember.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Member
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Image & Bio */}
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-zinc-100 flex items-center justify-center">
                    {teamMember.profile_image_url ? (
                      <Image
                        src={teamMember.profile_image_url}
                        alt={teamMember.name}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <User className="w-12 h-12 text-zinc-400" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2">{teamMember.name}</h3>
                  <p className="text-zinc-600 mb-4">{teamMember.position || 'Team Member'}</p>
                  <div className="prose max-w-none">
                    {teamMember.bio ? (
                      <p className="text-zinc-700 whitespace-pre-wrap">{teamMember.bio}</p>
                    ) : (
                      <p className="text-zinc-500 italic">No bio provided</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specializations */}
          {teamMember.specializations && teamMember.specializations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Specializations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(teamMember.specializations as string[]).map((specialization, index) => (
                    <Badge key={index} variant="outline">
                      {specialization}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Projects */}
          {teamMember.project_team_members && teamMember.project_team_members.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamMember.project_team_members.map((projectRelation, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded bg-zinc-100 flex-shrink-0 overflow-hidden">
                          {projectRelation.projects.featured_image_url ? (
                            <Image
                              src={projectRelation.projects.featured_image_url}
                              alt={projectRelation.projects.title}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-zinc-200 flex items-center justify-center">
                              <User className="w-6 h-6 text-zinc-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{projectRelation.projects.title}</h4>
                          <p className="text-xs text-zinc-500 mt-1">{projectRelation.projects.slug}</p>
                          <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto" asChild>
                            <Link href={`/admin/projects/${projectRelation.projects.id}`}>
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View Project
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamMember.email && (
                <div>
                  <label className="text-sm font-medium text-zinc-500">Email</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-zinc-400" />
                    <a 
                      href={`mailto:${teamMember.email}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {teamMember.email}
                    </a>
                  </div>
                </div>
              )}

              {teamMember.phone && (
                <div>
                  <label className="text-sm font-medium text-zinc-500">Phone</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-zinc-400" />
                    <a 
                      href={`tel:${teamMember.phone}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {teamMember.phone}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Member Details */}
          <Card>
            <CardHeader>
              <CardTitle>Member Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-500">Sort Order</label>
                <div className="mt-1">
                  <span className="text-sm">{teamMember.sort_order || 0}</span>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-zinc-500">Created</label>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm">{new Date(teamMember.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-500">Last Updated</label>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm">{new Date(teamMember.updated_at).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}