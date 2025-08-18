"use client"

import { useAuth } from '@/lib/auth-context'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Database, Shield, Activity, Users, Settings, FileText, Building2 } from 'lucide-react'
import Link from 'next/link'
import { useAdminStatsRealtime, useContactSubmissionsRealtime } from '@/lib/useRealtime'

interface DashboardStats {
  projects: number
  teamMembers: number
  services: number
  exploreContent: number
  partners: number
  contactSubmissions: number
  categories: number
}

export default function AdminDashboard() {
  const { user, adminProfile, loading, error, isAdmin } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    teamMembers: 0,
    services: 0,
    exploreContent: 0,
    partners: 0,
    contactSubmissions: 0,
    categories: 0
  })
  const [statsLoading, setStatsLoading] = useState(true)
  const [realtimeStatus, setRealtimeStatus] = useState('')

  // Set up real-time subscriptions for dashboard stats
  const { allConnected, connectionCount } = useAdminStatsRealtime(() => {
    console.log('📊 Real-time stats update triggered')
    if (isAdmin && !statsLoading) {
      fetchDashboardStats()
    }
  })

  // Set up real-time subscription for new contact submissions
  const { isConnected: contactRealtimeConnected } = useContactSubmissionsRealtime((newSubmission) => {
    console.log('💌 New contact submission received:', newSubmission)
    // Could show a toast notification here
    if (isAdmin && !statsLoading) {
      fetchDashboardStats() // Refresh stats to update unread count
    }
  })

  useEffect(() => {
    if (!loading && isAdmin) {
      console.log('🏠 Admin dashboard ready')
    }
  }, [loading, isAdmin])

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardStats()
    }
  }, [isAdmin])

  useEffect(() => {
    // Update realtime status for debugging
    if (allConnected) {
      setRealtimeStatus(`Connected to ${connectionCount}/7 tables`)
    } else {
      setRealtimeStatus(`Connecting... (${connectionCount}/7)`)
    }
  }, [allConnected, connectionCount])

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true)
      
      // Fetch data from all API endpoints
      const [
        projectsRes,
        teamRes,
        servicesRes,
        exploreRes,
        partnersRes,
        contactRes,
        categoriesRes
      ] = await Promise.all([
        fetch('/api/admin/projects?limit=1'),
        fetch('/api/admin/team?limit=1'),
        fetch('/api/admin/services?limit=1'),
        fetch('/api/admin/explore?limit=1'),
        fetch('/api/admin/partners?limit=1'),
        fetch('/api/admin/contact?limit=1'),
        fetch('/api/admin/categories?limit=1')
      ])

      const [
        projectsData,
        teamData,
        servicesData,
        exploreData,
        partnersData,
        contactData,
        categoriesData
      ] = await Promise.all([
        projectsRes.json(),
        teamRes.json(),
        servicesRes.json(),
        exploreRes.json(),
        partnersRes.json(),
        contactRes.json(),
        categoriesRes.json()
      ])

      setStats({
        projects: projectsData.pagination?.total || 0,
        teamMembers: teamData.pagination?.total || 0,
        services: servicesData.pagination?.total || 0,
        exploreContent: exploreData.pagination?.total || 0,
        partners: partnersData.pagination?.total || 0,
        contactSubmissions: contactData.pagination?.total || 0,
        categories: categoriesData.pagination?.total || 0
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00e4a0] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">You don't have admin access to this dashboard.</p>
            <Button asChild className="w-full">
              <Link href="/admin/login">Login as Admin</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-gray-700">Welcome back, {user?.email}</p>
            {/* Real-time status indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${allConnected ? 'bg-green-600' : 'bg-yellow-600'} animate-pulse`}></div>
              <span className="text-xs text-gray-700">{realtimeStatus}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {adminProfile?.id?.startsWith('temp-') ? 'Temporary Profile' : 'Database Profile'}
          </Badge>
          <Badge variant="default">
            {adminProfile?.role || 'admin'}
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-zinc-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <div className="animate-pulse bg-gray-300 h-8 w-12 rounded"></div>
              ) : (
                stats.projects
              )}
            </div>
            <p className="text-xs text-muted-foreground">Total projects</p>
          </CardContent>
        </Card>
        
        <Card className="border border-zinc-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <div className="animate-pulse bg-gray-300 h-8 w-12 rounded"></div>
              ) : (
                stats.teamMembers
              )}
            </div>
            <p className="text-xs text-muted-foreground">Total members</p>
          </CardContent>
        </Card>
        
        <Card className="border border-zinc-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <div className="animate-pulse bg-gray-300 h-8 w-12 rounded"></div>
              ) : (
                stats.services
              )}
            </div>
            <p className="text-xs text-muted-foreground">Total services</p>
          </CardContent>
        </Card>
        
        <Card className="border border-zinc-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <div className="animate-pulse bg-gray-300 h-8 w-12 rounded"></div>
              ) : (
                stats.contactSubmissions
              )}
            </div>
            <p className="text-xs text-muted-foreground">Contact submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-zinc-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Explore Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <div className="animate-pulse bg-gray-300 h-8 w-12 rounded"></div>
              ) : (
                stats.exploreContent
              )}
            </div>
            <p className="text-xs text-muted-foreground">Content items</p>
          </CardContent>
        </Card>
        
        <Card className="border border-zinc-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <div className="animate-pulse bg-gray-300 h-8 w-12 rounded"></div>
              ) : (
                stats.partners
              )}
            </div>
            <p className="text-xs text-muted-foreground">Active partners</p>
          </CardContent>
        </Card>
        
        <Card className="border border-zinc-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <div className="animate-pulse bg-gray-300 h-8 w-12 rounded"></div>
              ) : (
                stats.categories
              )}
            </div>
            <p className="text-xs text-muted-foreground">Total categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>Manage projects, team members, and content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/projects" prefetch={true}>
                <Building2 className="mr-2 h-4 w-4" />
                Manage Projects
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/team" prefetch={true}>
                <Users className="mr-2 h-4 w-4" />
                Team Members
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/explore" prefetch={true}>
                <FileText className="mr-2 h-4 w-4" />
                Explore Content
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Management</CardTitle>
            <CardDescription>Configure system settings and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/settings" prefetch={true}>
                <Settings className="mr-2 h-4 w-4" />
                Site Settings
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/contact" prefetch={true}>
                <Database className="mr-2 h-4 w-4" />
                Contact Submissions
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/logs" prefetch={true}>
                <Activity className="mr-2 h-4 w-4" />
                Activity Logs
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your admin account and profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/profile" prefetch={true}>
                <User className="mr-2 h-4 w-4" />
                My Profile
              </Link>
            </Button>
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> {isAdmin ? 'Admin' : 'User'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Profile:</strong> {adminProfile?.id?.startsWith('temp-') ? 'Temporary' : 'Database'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}