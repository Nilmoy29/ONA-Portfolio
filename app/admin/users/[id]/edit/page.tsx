"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { AdminProfile } from '@/lib/database-types'

interface EditUserFormData {
  full_name: string
  role: 'admin' | 'editor' | 'viewer'
  is_active: boolean
}

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState<EditUserFormData>({
    full_name: '',
    role: 'viewer',
    is_active: true
  })

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
        setFormData({
          full_name: data.data.full_name || '',
          role: data.data.role || 'viewer',
          is_active: data.data.is_active ?? true
        })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('User updated successfully!')
        setTimeout(() => router.push('/admin/users'), 1500)
      } else {
        setError(data.error || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      setError('An unexpected error occurred')
    } finally {
      setSaving(false)
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
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2 text-zinc-500">Loading user...</p>
        </div>
      </div>
    )
  }

  if (!user) {
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
          <AlertDescription>User not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-light text-zinc-900">Edit User</h1>
          <p className="text-zinc-600">Update user information and permissions</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter full name"
                required
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

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active User</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/users">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}