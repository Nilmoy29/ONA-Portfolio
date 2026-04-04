"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Edit, 
  ArrowLeft, 
  Calendar, 
  User, 
  FileText,
  Image,
  BookOpen,
  Camera,
  Eye,
  EyeOff
} from 'lucide-react'
import { ExploreContent, TeamMember } from '@/lib/database-types'

interface ContentWithAuthor extends ExploreContent {
  team_members?: TeamMember
}

export default function ViewContentPage() {
  const params = useParams()
  const router = useRouter()
  const [content, setContent] = useState<ContentWithAuthor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchContent()
  }, [params.id])

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/admin/explore/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setContent(data.data)
      } else {
        setError(data.error || 'Failed to fetch content')
      }
    } catch (error) {
      console.error('Error fetching content:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="h-5 w-5" />
      case 'artwork': return <Image className="h-5 w-5" />
      case 'research': return <BookOpen className="h-5 w-5" />
      case 'photography': return <Camera className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
    }
  }

  const getContentTypeName = (type: string) => {
    switch (type) {
      case 'article': return 'Article'
      case 'artwork': return 'Artwork'
      case 'research': return 'Research'
      case 'photography': return 'Photography'
      default: return type
    }
  }

  if (loading) {
    return <div className="flex justify-center py-8">Loading content...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!content) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Content not found</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/explore')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Content
          </Button>
          <div className="flex items-center gap-2">
            {getContentTypeIcon(content.content_type)}
            <Badge variant="outline" className="capitalize">
              {getContentTypeName(content.content_type)}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={content.is_published ? 'default' : 'secondary'}>
            {content.is_published ? (
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
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/explore/${content.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-light">{content.title}</CardTitle>
              {content.excerpt && (
                <p className="text-zinc-600 text-lg">{content.excerpt}</p>
              )}
            </CardHeader>
            <CardContent>
              {content.featured_image_url && (
                <div className="mb-6">
                  <img 
                    src={content.featured_image_url} 
                    alt={content.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              
              {content.content && (
                <div className="prose prose-zinc max-w-none">
                  <div className="whitespace-pre-wrap">{content.content}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {content.gallery_images && Array.isArray(content.gallery_images) && content.gallery_images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-light">Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {content.gallery_images.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-light">Content Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Calendar className="h-4 w-4" />
                <span>Created: {new Date(content.created_at).toLocaleDateString()}</span>
              </div>
              
              {content.updated_at && content.updated_at !== content.created_at && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Calendar className="h-4 w-4" />
                  <span>Updated: {new Date(content.updated_at).toLocaleDateString()}</span>
                </div>
              )}
              
              {content.published_at && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Calendar className="h-4 w-4" />
                  <span>Published: {new Date(content.published_at).toLocaleDateString()}</span>
                </div>
              )}

              {content.team_members && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <User className="h-4 w-4" />
                  <div className="flex items-center gap-2">
                    {content.team_members.profile_image_url && (
                      <img 
                        src={content.team_members.profile_image_url} 
                        alt={content.team_members.name}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-medium">{content.team_members.name}</div>
                      {content.team_members.position && (
                        <div className="text-xs text-zinc-500">{content.team_members.position}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-light">URL & SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-700">Slug</label>
                <p className="text-sm text-zinc-600 font-mono bg-zinc-100 px-2 py-1 rounded mt-1">
                  {content.slug}
                </p>
              </div>
              
              {content.is_published && (
                <div>
                  <label className="text-sm font-medium text-zinc-700">Public URL</label>
                  <p className="text-sm text-zinc-600 font-mono bg-zinc-100 px-2 py-1 rounded mt-1">
                    /explore/{content.slug}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}