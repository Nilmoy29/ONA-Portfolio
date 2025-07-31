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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Building, RefreshCw } from 'lucide-react'
import { Partner } from '@/lib/database-types'

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchPartners()
  }, [search, selectedStatus, page])

  const fetchPartners = async () => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(selectedStatus && selectedStatus !== 'all' && { status: selectedStatus }),
      })

      const response = await fetch(`/api/admin/partners?${params}`, {
        method: 'GET',
        credentials: 'include', // Important for session cookies
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to login if unauthorized
          window.location.href = '/admin/login'
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch partners')
      }

      const data = await response.json()

      if (data.data) {
        setPartners(data.data)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error: any) {
      console.error('Error fetching partners:', error)
      if (error.message.includes('Unauthorized') || error.message.includes('401')) {
        window.location.href = '/admin/login'
        return
      }
      setError(error.message || 'Failed to load partners')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id)
      const response = await fetch(`/api/admin/partners/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Important for session cookies
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to login if unauthorized
          window.location.href = '/admin/login'
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete partner')
      }

      // Refresh the list
      await fetchPartners()
    } catch (error: any) {
      console.error('Error deleting partner:', error)
      if (error.message.includes('Unauthorized') || error.message.includes('401')) {
        window.location.href = '/admin/login'
        return
      }
      setError(error.message || 'Failed to delete partner')
    } finally {
      setDeleting(null)
    }
  }

  const handleRefresh = () => {
    setPage(1)
    fetchPartners()
  }

  if (loading && partners.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-light text-zinc-900">Partners</h2>
            <p className="text-zinc-600">Manage clients and business partners</p>
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
          <h2 className="text-3xl font-light text-zinc-900">Partners</h2>
          <p className="text-zinc-600">Manage clients and business partners</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link href="/admin/partners/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Partner
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button variant="outline" size="sm" onClick={() => setError('')}>
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

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
                  placeholder="Search partners..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                      {partner.logo_url ? (
                        <img 
                          src={partner.logo_url} 
                          alt={partner.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                      ) : (
                        <Building className="w-5 h-5 text-zinc-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{partner.name}</div>
                      <div className="text-sm text-zinc-500">{partner.slug}</div>
                      {partner.description && (
                        <div className="text-sm text-zinc-500 max-w-xs truncate">
                          {partner.description}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {partner.partnership_type ? (
                    <Badge variant="outline" className="capitalize">
                      {partner.partnership_type}
                    </Badge>
                  ) : (
                    <span className="text-zinc-500">No type</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {partner.location || (
                      <span className="text-zinc-500">No location</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {partner.website_url ? (
                      <a 
                        href={partner.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    ) : (
                      <span className="text-zinc-500">No website</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={partner.is_published ? 'default' : 'secondary'}>
                    {partner.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-zinc-500">
                    {partner.sort_order || 0}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-zinc-500">
                    {partner.updated_at ? new Date(partner.updated_at).toLocaleDateString() : 'N/A'}
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
                        <Link href={`/admin/partners/${partner.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/partners/${partner.id}/edit`}>
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
                            <AlertDialogTitle>Delete Partner</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{partner.name}"? This action cannot be undone and will permanently remove the partner and all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(partner.id)}
                              disabled={deleting === partner.id}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {deleting === partner.id ? 'Deleting...' : 'Delete'}
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

        {partners.length === 0 && !loading && (
          <div className="text-center py-8 text-zinc-500">
            {search || selectedStatus ? (
              <div>
                <p>No partners found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearch('')
                    setSelectedStatus('all')
                  }}
                  className="mt-2"
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div>
                <p>No partners found.</p>
                <Link href="/admin/partners/new" className="text-blue-600 hover:underline">
                  Create your first partner
                </Link>
              </div>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 p-4">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1 || loading}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages || loading}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}