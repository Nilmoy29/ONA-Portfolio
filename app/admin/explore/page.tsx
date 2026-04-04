"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  FileText,
  Image,
  BookOpen,
  Camera
} from 'lucide-react'
import { ExploreContent } from '@/lib/database-types'

interface ExploreContentWithAuthor extends ExploreContent {
  team_members?: {
    id: string
    name: string
    position: string | null
    profile_image_url: string | null
  }
}

export default function ExploreContentPage() {
  const [content, setContent] = useState<ExploreContentWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [contentTypeFilter, setContentTypeFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchContent()
  }, [currentPage, searchTerm, contentTypeFilter])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      })

      if (searchTerm) params.append('search', searchTerm)
      if (contentTypeFilter && contentTypeFilter !== 'all') params.append('content_type', contentTypeFilter)

      const response = await fetch(`/api/admin/explore?${params}`)
      const data = await response.json()

      if (response.ok) {
        setContent(data.data)
        setTotalPages(data.pagination.totalPages)
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return

    try {
      const response = await fetch(`/api/admin/explore/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchContent()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete content')
      }
    } catch (error) {
      console.error('Error deleting content:', error)
      setError('An unexpected error occurred')
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="h-4 w-4" />
      case 'artwork': return <Image className="h-4 w-4" />
      case 'research': return <BookOpen className="h-4 w-4" />
      case 'photography': return <Camera className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getStatusBadge = (isPublished: boolean) => {
    return (
      <Badge variant={isPublished ? 'default' : 'secondary'}>
        {isPublished ? 'Published' : 'Draft'}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light text-zinc-900">Explore Content</h1>
          <p className="text-zinc-600">Manage articles, artwork, research, and photography</p>
        </div>
        <Button asChild>
          <Link href="/admin/explore/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-light">Content Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Content Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="article">Articles</SelectItem>
                <SelectItem value="artwork">Artwork</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading content...</div>
          ) : content.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              No content found. Create your first piece of content!
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {content.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getContentTypeIcon(item.content_type)}
                          <span className="truncate max-w-[200px]">{item.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {item.content_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.team_members ? (
                          <div className="flex items-center gap-2">
                            {item.team_members.profile_image_url && (
                              <img 
                                src={item.team_members.profile_image_url} 
                                alt={item.team_members.name}
                                className="w-6 h-6 rounded-full"
                              />
                            )}
                            <span className="text-sm">{item.team_members.name}</span>
                          </div>
                        ) : (
                          <span className="text-zinc-500">No author</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(item.is_published)}
                      </TableCell>
                      <TableCell>
                        {new Date(item.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <Link href={`/admin/explore/${item.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <Link href={`/admin/explore/${item.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-zinc-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}