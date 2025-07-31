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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, User, Crown } from 'lucide-react'
import { AdminProfile } from '@/lib/database-types'

interface CreateUserFormData {
  full_name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  is_active: boolean
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [formData, setFormData] = useState<CreateUserFormData>({
    full_name: '',
    email: '',
    role: 'viewer',
    is_active: true
  })

  useEffect(() => {
    fetchUsers()
  }, [search, selectedRole, selectedStatus, page])

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(selectedRole && selectedRole !== 'all' && { role: selectedRole }),
        ...(selectedStatus && selectedStatus !== 'all' && { status: selectedStatus }),
      })

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()

      if (data.data) {
        setUsers(data.data)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async () => {
    setCreateLoading(true)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowCreateDialog(false)
        setFormData({
          full_name: '',
          email: '',
          role: 'viewer',
          is_active: true
        })
        fetchUsers()
      }
    } catch (error) {
      console.error('Error creating user:', error)
    } finally {
      setCreateLoading(false)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !currentStatus
        }),
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'editor':
        return 'bg-blue-100 text-blue-800'
      case 'viewer':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4" />
      case 'editor':
        return <Edit className="w-4 h-4" />
      case 'viewer':
        return <Eye className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-light text-zinc-900">Admin Users</h2>
            <p className="text-zinc-600">Manage administrative users and permissions</p>
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
          <h2 className="text-3xl font-light text-zinc-900">Admin Users</h2>
          <p className="text-zinc-600">Manage administrative users and permissions</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Admin User</DialogTitle>
              <DialogDescription>
                Create a new administrative user with specific role and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as any }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin - Full Access</SelectItem>
                    <SelectItem value="editor">Editor - Content Management</SelectItem>
                    <SelectItem value="viewer">Viewer - Read Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active User</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleCreateUser} 
                disabled={createLoading || !formData.full_name || !formData.email}
              >
                {createLoading ? 'Creating...' : 'Create User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div>
                      <div className="font-medium">{user.full_name}</div>
                      <div className="text-sm text-zinc-500">ID: {user.id.slice(0, 8)}...</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleColor(user.role)} variant="outline">
                    <div className="flex items-center gap-1">
                      {getRoleIcon(user.role)}
                      {user.role}
                    </div>
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.is_active ? 'default' : 'secondary'}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-zinc-500">
                    {user.last_login 
                      ? new Date(user.last_login).toLocaleDateString()
                      : 'Never'
                    }
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-zinc-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {(user.permissions as any)?.can_manage_users && (
                      <Badge variant="outline" className="text-xs">Users</Badge>
                    )}
                    {(user.permissions as any)?.can_manage_content && (
                      <Badge variant="outline" className="text-xs">Content</Badge>
                    )}
                    {(user.permissions as any)?.can_manage_settings && (
                      <Badge variant="outline" className="text-xs">Settings</Badge>
                    )}
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
                        <Link href={`/admin/users/${user.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(user.id, user.is_active)}>
                        {user.is_active ? 'Deactivate' : 'Activate'}
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
                              user account and all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(user.id)}>
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

        {users.length === 0 && (
          <div className="text-center py-8 text-zinc-500">
            No users found. Create your first admin user to get started.
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