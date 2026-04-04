"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Building, 
  Users, 
  Briefcase, 
  FileText, 
  Heart, 
  Mail, 
  AlertCircle,
  Activity,
  Database,
  Settings
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

interface DashboardStats {
  projects: number
  publishedProjects: number
  teamMembers: number
  services: number
  exploreContent: number
  partners: number
  contactSubmissions: number
  unreadContacts: number
  categories: number
}

interface RecentActivity {
  id: string
  action: string
  entity_type: string
  details: any
  created_at: string
}

export default function AdminDashboard() {
  const { user, adminProfile, loading: authLoading, error: authError, isAdmin } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    publishedProjects: 0,
    teamMembers: 0,
    services: 0,
    exploreContent: 0,
    partners: 0,
    contactSubmissions: 0,
    unreadContacts: 0,
    categories: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData()
    }
  }, [isAdmin])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Create promises for all API calls with better error handling
      const apiCalls = [
        { name: 'projects', url: '/api/admin/projects?limit=1000' },
        { name: 'team', url: '/api/admin/team?limit=1000' },
        { name: 'services', url: '/api/admin/services?limit=1000' },
        { name: 'explore', url: '/api/admin/explore?limit=1000' },
        { name: 'partners', url: '/api/admin/partners?limit=1000' },
        { name: 'contact', url: '/api/admin/contact?limit=1000' },
        { name: 'categories', url: '/api/admin/categories?limit=1000' },
        { name: 'logs', url: '/api/admin/logs?limit=10' }
      ]

      // Fetch each API with individual error handling
      const results = await Promise.allSettled(
        apiCalls.map(async ({ name, url }) => {
          try {
            const response = await fetch(url)
            if (!response.ok) {
              console.warn(`API ${name} failed with status:`, response.status)
              return { name, data: [], error: `HTTP ${response.status}` }
            }
            const result = await response.json()
            return { name, data: result.data || [], error: null }
          } catch (error: any) {
            console.warn(`API ${name} failed:`, error)
            return { name, data: [], error: error.message }
          }
        })
      )

      // Process results and extract data
      const dataMap: Record<string, any[]> = {}
      results.forEach((result, index) => {
        const apiName = apiCalls[index].name
        if (result.status === 'fulfilled' && result.value) {
          dataMap[apiName] = result.value.data || []
        } else {
          console.warn(`Promise rejected for ${apiName}:`, result.status === 'rejected' ? result.reason : 'Unknown error')
          dataMap[apiName] = []
        }
      })

      // Count published items and unread contacts safely
      const publishedProjects = Array.isArray(dataMap.projects) 
        ? dataMap.projects.filter((p: any) => p.is_published)?.length || 0 
        : 0
      const unreadContacts = Array.isArray(dataMap.contact) 
        ? dataMap.contact.filter((c: any) => !c.is_read)?.length || 0 
        : 0

      setStats({
        projects: Array.isArray(dataMap.projects) ? dataMap.projects.length : 0,
        publishedProjects,
        teamMembers: Array.isArray(dataMap.team) ? dataMap.team.length : 0,
        services: Array.isArray(dataMap.services) ? dataMap.services.length : 0,
        exploreContent: Array.isArray(dataMap.explore) ? dataMap.explore.length : 0,
        partners: Array.isArray(dataMap.partners) ? dataMap.partners.length : 0,
        contactSubmissions: Array.isArray(dataMap.contact) ? dataMap.contact.length : 0,
        unreadContacts,
        categories: Array.isArray(dataMap.categories) ? dataMap.categories.length : 0,
      })

      setRecentActivity(Array.isArray(dataMap.logs) ? dataMap.logs : [])

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err)
      setError(err.message || 'Failed to load dashboard data')
      
      // Set default stats to prevent display issues
      setStats({
        projects: 0,
        publishedProjects: 0,
        teamMembers: 0,
        services: 0,
        exploreContent: 0,
        partners: 0,
        contactSubmissions: 0,
        unreadContacts: 0,
        categories: 0,
      })
      setRecentActivity([])
    } finally {
      setLoading(false)
    }
  }

  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }
    return response.json()
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
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

  const statCards = [
    {
      title: 'Projects',
      value: stats.projects,
      description: `${stats.publishedProjects} published`,
      icon: Building,
      color: 'bg-blue-500',
      href: '/admin/projects'
    },
    {
      title: 'Team Members',
      value: stats.teamMembers,
      description: 'Active team members',
      icon: Users,
      color: 'bg-green-500',
      href: '/admin/team'
    },
    {
      title: 'Services',
      value: stats.services,
      description: 'Service offerings',
      icon: Briefcase,
      color: 'bg-purple-500',
      href: '/admin/services'
    },
    {
      title: 'Explore Content',
      value: stats.exploreContent,
      description: 'Articles & research',
      icon: FileText,
      color: 'bg-yellow-500',
      href: '/admin/explore'
    },
    {
      title: 'Partners',
      value: stats.partners,
      description: 'Clients & collaborators',
      icon: Heart,
      color: 'bg-pink-500',
      href: '/admin/partners'
    },
    {
      title: 'Contact Submissions',
      value: stats.contactSubmissions,
      description: `${stats.unreadContacts} unread`,
      icon: Mail,
      color: 'bg-red-500',
      href: '/admin/contact'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.email}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {adminProfile?.role || 'admin'}
          </Badge>
          <Badge variant="default">
            Active
          </Badge>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchDashboardData}
              className="ml-2"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href={stat.href}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {loading ? (
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    stat.value
                  )}
                </div>
                <CardDescription className="text-xs">
                  {stat.description}
                </CardDescription>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest admin actions and system updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 animate-pulse">
                    <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 capitalize">
                        {activity.action} {activity.entity_type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.details?.name || activity.details?.title || 'System update'}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.entity_type}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link
                href="/admin/projects/new"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Add New Project</span>
                </div>
                <span className="text-xs text-gray-500">→</span>
              </Link>
              
              <Link
                href="/admin/team/new"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Add Team Member</span>
                </div>
                <span className="text-xs text-gray-500">→</span>
              </Link>
              
              <Link
                href="/admin/explore/new"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Create Content</span>
                </div>
                <span className="text-xs text-gray-500">→</span>
              </Link>
              
              <Link
                href="/admin/services/new"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Add Service</span>
                </div>
                <span className="text-xs text-gray-500">→</span>
              </Link>
              
              <Link
                href="/admin/settings"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Settings className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Site Settings</span>
                </div>
                <span className="text-xs text-gray-500">→</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Status
          </CardTitle>
          <CardDescription>
            Current system health and configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-green-600 font-semibold">Database</div>
              <div className="text-sm text-green-600">Connected</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-green-600 font-semibold">Authentication</div>
              <div className="text-sm text-green-600">Active</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-green-600 font-semibold">RLS Policies</div>
              <div className="text-sm text-green-600">Enabled</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}