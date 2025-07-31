"use client"

import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AdminStatus() {
  const { user, isAdmin, loading, adminProfile, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut()
    router.push('/admin/login')
  }

  const handleGoToDashboard = () => {
    router.push('/admin/dashboard')
  }

  const authStatus = {
    hasUser: !!user,
    hasAdminProfile: !!adminProfile,
    isAdmin,
    loading,
    pathname,
    userEmail: user?.email,
    adminRole: adminProfile?.role,
    adminActive: adminProfile?.is_active
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-zinc-900">Admin Status</h1>
          <p className="text-zinc-600">Current authentication and system status</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGoToDashboard} variant="outline">
            Go to Dashboard
          </Button>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Auth Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Authentication Status
              <Badge variant={isAdmin ? "default" : "destructive"}>
                {isAdmin ? "Authenticated" : "Not Authenticated"}
              </Badge>
            </CardTitle>
            <CardDescription>
              Current authentication state and user information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Loading:</strong> {loading ? "Yes" : "No"}
            </div>
            <div>
              <strong>Has User:</strong> {authStatus.hasUser ? "Yes" : "No"}
            </div>
            <div>
              <strong>User Email:</strong> {authStatus.userEmail || "Not set"}
            </div>
            <div>
              <strong>Has Admin Profile:</strong> {authStatus.hasAdminProfile ? "Yes" : "No"}
            </div>
            <div>
              <strong>Admin Role:</strong> {authStatus.adminRole || "Not set"}
            </div>
            <div>
              <strong>Admin Active:</strong> {authStatus.adminActive ? "Yes" : "No"}
            </div>
            <div>
              <strong>Is Admin:</strong> {authStatus.isAdmin ? "Yes" : "No"}
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>
              Current page and system status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Current Path:</strong> {pathname}
            </div>
            <div>
              <strong>Expected State:</strong> {isAdmin ? "Admin Dashboard" : "Login Page"}
            </div>
            <div>
              <strong>Auth Flow:</strong> {
                loading ? "Loading..." :
                !user ? "No user session" :
                !adminProfile ? "Missing admin profile" :
                !isAdmin ? "Not authorized" :
                "Fully authenticated"
              }
            </div>
            <div>
              <strong>Timestamp:</strong> {new Date().toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* Debug Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
            <CardDescription>
              Raw authentication data for debugging
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-zinc-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(authStatus, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Test different authentication scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Button onClick={() => router.push('/admin/login')} variant="outline">
            Go to Login
          </Button>
          <Button onClick={() => router.push('/admin/dashboard')} variant="outline">
            Go to Dashboard
          </Button>
          <Button onClick={() => router.push('/admin/projects')} variant="outline">
            Go to Projects
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline">
            Reload Page
          </Button>
          <Button onClick={handleLogout} variant="destructive">
            Force Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}