"use client"

import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

interface SimpleAdminLayoutProps {
  children: React.ReactNode
}

export function SimpleAdminLayout({ children }: SimpleAdminLayoutProps) {
  const { user, isAdmin, loading, error, refreshProfile, adminProfile } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const redirectRef = useRef(false)

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle authentication redirects - only once when needed and prevent loops
  useEffect(() => {
    // Don't do anything if not mounted, still loading, or already redirecting
    if (!mounted || loading || redirectRef.current) return
    
    // Only redirect unauthenticated users away from protected pages
    if (pathname !== '/admin/login' && !isAdmin) {
      console.log('🔄 Redirecting unauthenticated user to login')
      redirectRef.current = true
      router.push('/admin/login')
      
      // Reset redirect flag after a delay to allow for navigation
      setTimeout(() => {
        redirectRef.current = false
      }, 2000)
    }
  }, [mounted, loading, isAdmin, pathname, router])

  // Reset redirect flag when auth state becomes valid
  useEffect(() => {
    if (isAdmin && redirectRef.current) {
      redirectRef.current = false
    }
  }, [isAdmin])

  // Show loading spinner while auth is loading or not mounted
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto"></div>
          <p className="mt-4 text-zinc-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  // Show error state if there's an authentication error
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="space-y-2">
            <Button onClick={refreshProfile} variant="outline" className="mr-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Button onClick={() => router.push('/admin/login')} variant="default">
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Login page - no layout wrapper
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Protected pages - require authentication
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
          <p className="text-zinc-600 mb-4">You need to be logged in as an administrator to access this page.</p>
          <div className="space-y-2">
            <Button onClick={() => router.push('/admin/login')} variant="default">
            Go to Login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Admin interface with full layout
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <AdminHeader />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}