"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { Search, MoreHorizontal, Eye, Trash2, CheckCircle, Mail } from 'lucide-react'
import { ContactSubmission } from '@/lib/database-types'

export default function ContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchSubmissions()
  }, [search, page])

  const fetchSubmissions = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
      })

      const response = await fetch(`/api/admin/contact?${params}`)
      const data = await response.json()

      if (data.data) {
        setSubmissions(data.data)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: true }),
      })

      if (response.ok) {
        fetchSubmissions()
      }
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleUpdateNotes = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admin_notes: adminNotes }),
      })

      if (response.ok) {
        fetchSubmissions()
        setAdminNotes('')
        setSelectedSubmission(null)
      }
    } catch (error) {
      console.error('Error updating notes:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/contact/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchSubmissions()
      }
    } catch (error) {
      console.error('Error deleting submission:', error)
    }
  }


  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-light text-zinc-900">Contact Submissions</h2>
          <p className="text-zinc-600">Manage contact form submissions</p>
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
          <h2 className="text-3xl font-light text-zinc-900">Contact Submissions</h2>
          <p className="text-zinc-600">Manage contact form submissions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-light">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search submissions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id} className={!submission.is_read ? 'bg-blue-50' : ''}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-medium">{submission.name}</div>
                    <div className="text-sm text-zinc-500">{submission.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm max-w-xs truncate">
                    {submission.message ? submission.message.substring(0, 50) + '...' : 'No message'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    Contact Inquiry
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Badge variant={submission.is_read ? 'default' : 'secondary'}>
                      {submission.is_read ? 'Read' : 'Unread'}
                    </Badge>
                    {!submission.is_read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-zinc-500">
                    {new Date(submission.created_at).toLocaleDateString()}
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Contact Submission Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Name</label>
                                <p className="text-sm text-zinc-600">{submission.name}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Email</label>
                                <p className="text-sm text-zinc-600">{submission.email}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Submitted</label>
                                <p className="text-sm text-zinc-600">{new Date(submission.created_at).toLocaleString()}</p>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Message</label>
                              <p className="text-sm text-zinc-600 whitespace-pre-wrap">{submission.message}</p>
                            </div>
                            {submission.admin_notes && (
                              <div>
                                <label className="text-sm font-medium">Admin Notes</label>
                                <p className="text-sm text-zinc-600">{submission.admin_notes}</p>
                              </div>
                            )}
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedSubmission(submission)
                                  setAdminNotes(submission.admin_notes || '')
                                }}
                              >
                                Add Notes
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => window.open(`mailto:${submission.email}?subject=Re: Your inquiry`)}
                              >
                                <Mail className="mr-2 h-4 w-4" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {!submission.is_read && (
                        <DropdownMenuItem onClick={() => handleMarkAsRead(submission.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Read
                        </DropdownMenuItem>
                      )}
                      
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
                              contact submission.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(submission.id)}>
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

        {submissions.length === 0 && (
          <div className="text-center py-8 text-zinc-500">
            No contact submissions found.
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

      {/* Admin Notes Dialog */}
      {selectedSubmission && (
        <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Admin Notes</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Notes for: {selectedSubmission.name}</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this submission..."
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleUpdateNotes(selectedSubmission.id)}>
                  Save Notes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}