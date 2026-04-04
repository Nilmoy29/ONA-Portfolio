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
  Calendar,
  Loader2,
  User,
  Crown,
  Shield,
  Eye,
  Settings,
  Activity
} from 'lucide-react'
import { AdminProfile } from '@/lib/database-types'

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin': return Crown
    case 'editor': return Edit
    case 'viewer': return Eye
    default: return User
  }
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-red-100 text-red-800'
    case 'editor': return 'bg-blue-100 text-blue-800'
    case 'viewer': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const formatRole = (role: string) => {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

export default function UserDetailPage() {
  const params = useParams()
  const [user, setUser] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchUser(params.id as string)
    }
  }, [params.id])

  const fetchUser = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`)
      const data = await response.json()

      if (response.ok && data.data) {
        setUser(data.data)
      } else {
        setError(data.error || 'Failed to fetch user')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
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
            <Link href="/admin/users">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Link>
          </Button>
        </div>
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2 text-zinc-500">Loading user...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/users">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Link>
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error || 'User not found'}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const RoleIcon = getRoleIcon(user.role)
  const permissions = user.permissions as any

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/users">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center overflow-hidden">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.full_name || 'User'}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              ) : (
                <User className="w-6 h-6 text-zinc-600" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-light text-zinc-900">{user.full_name || 'Unnamed User'}</h1>
              <p className="text-zinc-600">Admin User Details</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={user.is_active ? 'default' : 'secondary'}>
            {user.is_active ? 'Active' : 'Inactive'}
          </Badge>
          <Button asChild>
            <Link href={`/admin/users/${user.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit User
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Profile */}
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-zinc-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {user.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt={user.full_name || 'User'}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <User className="w-8 h-8 text-zinc-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium mb-2">{user.full_name || 'Unnamed User'}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={getRoleColor(user.role)}>
                      <RoleIcon className="w-3 h-3 mr-1" />
                      {formatRole(user.role)}
                    </Badge>
                    <Badge variant={user.is_active ? 'default' : 'destructive'}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="font-medium text-zinc-500">User ID</label>
                      <p className="mt-1 font-mono text-xs">{user.id.slice(0, 8)}...</p>
                    </div>
                    <div>
                      <label className="font-medium text-zinc-500">Login Count</label>
                      <p className="mt-1">{user.login_count || 0} times</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Permissions
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {permissions && typeof permissions === 'object' ? (
                  Object.entries(permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                      <span className="text-sm font-medium">
                        {key.replace('can_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <Badge variant={value ? 'default' : 'secondary'}>
                        {value ? 'Allowed' : 'Denied'}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 italic col-span-2">No specific permissions configured</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity Overview */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Activity Overview
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-zinc-50 rounded-lg">
                  <div className="text-2xl font-bold text-zinc-900">{user.login_count || 0}</div>
                  <div className="text-sm text-zinc-500">Total Logins</div>
                </div>
                <div className="text-center p-4 bg-zinc-50 rounded-lg">
                  <div className="text-2xl font-bold text-zinc-900">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                  </div>
                  <div className="text-sm text-zinc-500">Last Login</div>
                </div>
                <div className="text-center p-4 bg-zinc-50 rounded-lg">
                  <div className="text-2xl font-bold text-zinc-900">
                    {Math.ceil((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-sm text-zinc-500">Days Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-500">Role</label>
                <div className="mt-1">
                  <Badge className={getRoleColor(user.role)}>
                    <RoleIcon className="w-3 h-3 mr-1" />
                    {formatRole(user.role)}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-500">Status</label>
                <div className="mt-1">
                  <Badge variant={user.is_active ? 'default' : 'destructive'}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-zinc-500">Last Login</label>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm">
                    {user.last_login 
                      ? new Date(user.last_login).toLocaleString()
                      : 'Never logged in'
                    }
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-500">Created</label>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm">{new Date(user.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-500">Last Updated</label>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm">{new Date(user.updated_at).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href={`/admin/users/${user.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit User
                </Link>
              </Button>
              
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/admin/users">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Users
                </Link>
              </Button>

              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/admin/logs?user_id=${user.id}">
                  <Activity className="h-4 w-4 mr-2" />
                  View Activity Logs
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}