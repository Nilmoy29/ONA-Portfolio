"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'
import { Project, Category } from '@/lib/database-types'

interface ProjectWithCategory extends Project {
  categories?: {
    id: string
    name: string
    color: string
  }
}
import { supabase } from '@/lib/supabase'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchProjects()
    fetchCategories()
  }, [search, selectedCategory, selectedStatus, page])

  const fetchProjects = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(selectedCategory && selectedCategory !== 'all' && { category: selectedCategory }),
        ...(selectedStatus && selectedStatus !== 'all' && { status: selectedStatus }),
      })

      const response = await fetch(`/api/admin/projects?${params}`)
      if (response.ok) {
        const data = await response.json()
        if (data?.data) {
          setProjects(data.data)
          setTotalPages(data.pagination.totalPages)
          return
        }
      }

      // Fallback to direct Supabase query if API fails
      const limit = 10
      const from = (page - 1) * limit
      const to = from + limit - 1

      let query = supabase
        .from('projects')
        .select(
          `*,
           categories (
             id,
             name,
             color
           )`,
          { count: 'exact' }
        )
        .order('sort_order', { ascending: true })
        .range(from, to)

      if (search) {
        query = query.or(
          `title.ilike.%${search}%,description.ilike.%${search}%,client_name.ilike.%${search}%`
        )
      }
      if (selectedCategory && selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory)
      }
      if (selectedStatus && selectedStatus !== 'all') {
        query = query.eq('project_status', selectedStatus)
      }

      const { data: rows, count, error } = await query
      if (error) {
        console.error('Admin projects fallback query error:', error)
      }
      setProjects((rows as any) || [])
      setTotalPages(Math.max(1, Math.ceil((count || 0) / limit)))
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchProjects()
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const handleSortOrderUpdate = async (id: string, newSortOrder: number) => {
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sort_order: newSortOrder }),
      })

      if (response.ok) {
        fetchProjects()
      }
    } catch (error) {
      console.error('Error updating sort order:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'construction':
        return 'bg-blue-100 text-blue-800'
      case 'design':
        return 'bg-purple-100 text-purple-800'
      case 'planning':
        return 'bg-yellow-100 text-yellow-800'
      case 'on-hold':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-light text-zinc-900">Projects</h2>
            <p className="text-zinc-600">Manage architectural projects</p>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-zinc-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-light text-zinc-900">Projects</h2>
          <p className="text-zinc-600">Manage architectural projects</p>
        </div>
        <Link href="/admin/projects/new" prefetch={true}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-light">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex flex-col">
                  <span>Sort Order</span>
                  <span className="text-xs text-zinc-500 font-normal">Lower = First</span>
                </div>
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <Input
                    type="number"
                    value={project.sort_order || 0}
                    onChange={(e) => handleSortOrderUpdate(project.id, parseInt(e.target.value) || 0)}
                    className="w-16 h-8 text-sm"
                    min="0"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-medium">{project.title}</div>
                    <div className="text-sm text-zinc-500">{project.slug}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {project.categories && (
                    <Badge variant="outline" style={{ backgroundColor: `${project.categories.color}20` }}>
                      {project.categories.name}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(project.project_status || 'planning')}>
                    {project.project_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {project.client_name || 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={project.is_published ? 'default' : 'secondary'}>
                    {project.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-zinc-500">
                    {new Date(project.updated_at).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/projects/${project.slug}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/projects/${project.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the
                              project and all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(project.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {projects.length === 0 && (
          <div className="text-center py-8 text-zinc-500">
            No projects found. <Link href="/admin/projects/new" className="text-blue-600 hover:underline">Create your first project</Link>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 p-4">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}