"use client"

import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAdmin, loading, adminProfile } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // For login page, don't use the admin layout
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto"></div>
          <p className="mt-4 text-zinc-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, redirect to login
  if (!user) {
    router.replace('/admin/login')
    return null
  }

  // If user exists but no admin profile, show loading
  if (!adminProfile) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto"></div>
          <p className="mt-4 text-zinc-600">Setting up admin access...</p>
        </div>
      </div>
    )
  }

  // If not admin, redirect to login
  if (!isAdmin) {
    router.replace('/admin/login')
    return null
  }

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