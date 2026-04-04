"use client"

import { useAuth } from '@/lib/auth-context'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AdminDebugPage() {
  const { user, session, adminProfile, loading, error, isAdmin, refreshProfile } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const fetchDebugInfo = async () => {
      try {
        // Test API connection
        const profileResponse = await fetch(`/api/admin/profile?userId=${user?.id}`)
        const profileData = profileResponse.ok ? await profileResponse.json() : { error: 'API failed' }

        setDebugInfo({
          timestamp: new Date().toISOString(),
          apiStatus: profileResponse.ok ? 'OK' : 'Failed',
          apiResponse: profileData,
          userAgent: navigator.userAgent,
          url: window.location.href,
        })
      } catch (err) {
        setDebugInfo({
          timestamp: new Date().toISOString(),
          apiStatus: 'Error',
          error: err instanceof Error ? err.message : String(err),
        })
      }
    }

    if (user?.id && !loading) {
      fetchDebugInfo()
    }
  }, [user?.id, loading])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Debug Panel</h1>
        <Button onClick={refreshProfile} variant="outline">
          Refresh Profile
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Auth Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Auth Status
              <Badge variant={isAdmin ? "default" : error ? "destructive" : "secondary"}>
                {loading ? "Loading" : isAdmin ? "Admin" : error ? "Error" : "No Access"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <strong>Loading:</strong> {loading ? "Yes" : "No"}
            </div>
            <div>
              <strong>Error:</strong> {error || "None"}
            </div>
            <div>
              <strong>Is Admin:</strong> {isAdmin ? "Yes" : "No"}
            </div>
            <div>
              <strong>User ID:</strong> {user?.id || "None"}
            </div>
            <div>
              <strong>User Email:</strong> {user?.email || "None"}
            </div>
          </CardContent>
        </Card>

        {/* Session Info */}
        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <strong>Session Exists:</strong> {session ? "Yes" : "No"}
            </div>
            <div>
              <strong>Access Token:</strong> {session?.access_token ? "Present" : "Missing"}
            </div>
            <div>
              <strong>Expires At:</strong> {session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : "N/A"}
            </div>
            <div>
              <strong>Token Type:</strong> {session?.token_type || "N/A"}
            </div>
          </CardContent>
        </Card>

        {/* Admin Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {adminProfile ? (
              <div className="space-y-3">
                <div>
                  <strong>Profile ID:</strong> {adminProfile.id}
                </div>
                <div>
                  <strong>Full Name:</strong> {adminProfile.full_name}
                </div>
                <div>
                  <strong>Role:</strong> {adminProfile.role}
                </div>
                <div>
                  <strong>Active:</strong> {adminProfile.is_active ? "Yes" : "No"}
                </div>
                <div>
                  <strong>Login Count:</strong> {adminProfile.login_count}
                </div>
                <div>
                  <strong>Last Login:</strong> {adminProfile.last_login ? new Date(adminProfile.last_login).toLocaleString() : "Never"}
                </div>
                <div>
                  <strong>Permissions:</strong>
                  <pre className="text-xs mt-1 p-2 bg-gray-100 rounded overflow-auto max-h-32">
                    {JSON.stringify(adminProfile.permissions, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No admin profile loaded</p>
            )}
          </CardContent>
        </Card>

        {/* API Debug */}
        <Card>
          <CardHeader>
            <CardTitle>API Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <strong>API Status:</strong> {debugInfo.apiStatus || "Not tested"}
              </div>
              <div>
                <strong>Timestamp:</strong> {debugInfo.timestamp || "N/A"}
              </div>
              {debugInfo.apiResponse && (
                <div>
                  <strong>API Response:</strong>
                  <pre className="text-xs mt-1 p-2 bg-gray-100 rounded overflow-auto max-h-32">
                    {JSON.stringify(debugInfo.apiResponse, null, 2)}
                  </pre>
                </div>
              )}
              {debugInfo.error && (
                <div>
                  <strong>API Error:</strong> {debugInfo.error}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <strong>URL:</strong> {debugInfo.url}
          </div>
          <div>
            <strong>User Agent:</strong> 
            <p className="text-xs mt-1 break-all">{debugInfo.userAgent}</p>
          </div>
          <div>
            <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || "Not configured"}
          </div>
          <div>
            <strong>Environment:</strong> {process.env.NODE_ENV}
          </div>
        </CardContent>
      </Card>

      {/* Raw Data (for debugging) */}
      <Card>
        <CardHeader>
          <CardTitle>Raw Auth Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs p-4 bg-gray-100 rounded overflow-auto max-h-64">
            {JSON.stringify({
              user: user ? {
                id: user.id,
                email: user.email,
                created_at: user.created_at,
                last_sign_in_at: user.last_sign_in_at,
              } : null,
              session: session ? {
                expires_at: session.expires_at,
                token_type: session.token_type,
                provider_token: session.provider_token ? "Present" : null,
              } : null,
              adminProfile,
              isAdmin,
              loading,
              error,
            }, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
} 