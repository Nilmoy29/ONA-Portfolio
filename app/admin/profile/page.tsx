"use client"

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { User, Shield, Mail, Calendar, RefreshCw } from 'lucide-react'

export default function AdminProfile() {
  const { user, adminProfile, refreshProfile } = useAuth()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshProfile()
    } catch (error) {
      console.error('Error refreshing profile:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-light text-zinc-900">Profile Settings</h2>
        <p className="text-zinc-600">Manage your admin account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>
              Your authentication details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium">{user?.email || 'Not available'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>User ID</Label>
              <div className="text-sm font-mono text-zinc-600 bg-zinc-50 p-2 rounded">
                {user?.id || 'Not available'}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Account Created</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-zinc-500" />
                <span className="text-sm">
                  {user?.created_at ? formatDate(user.created_at) : 'Not available'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Last Sign In</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-zinc-500" />
                <span className="text-sm">
                  {user?.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Not available'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Profile
            </CardTitle>
            <CardDescription>
              Your administrative access and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {adminProfile ? (
              <>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Badge variant="outline" className="capitalize">
                    {adminProfile.role}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label>Profile Created</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm">
                      {formatDate(adminProfile.created_at)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Last Updated</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm">
                      {formatDate(adminProfile.updated_at)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Admin Profile ID</Label>
                  <div className="text-sm font-mono text-zinc-600 bg-zinc-50 p-2 rounded">
                    {adminProfile.id}
                  </div>
                </div>
              </>
            ) : (
              <Alert>
                <AlertDescription>
                  No admin profile found. This may indicate a configuration issue.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-light">Account Actions</CardTitle>
          <CardDescription>
            Manage your account settings and data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 