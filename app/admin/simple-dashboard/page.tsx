"use client"

import { useAuth } from '@/lib/auth-context'
import { useEffect, useState } from 'react'

export default function SimpleDashboard() {
  const { user, isAdmin, loading, adminProfile, error } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Authentication Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">Access Denied</h2>
            <p className="text-yellow-700 mb-4">You need admin access to view this dashboard.</p>
            <a 
              href="/admin/login" 
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 inline-block"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-6">Simple Dashboard</h1>
      
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-800">✅ Authentication Success</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>User:</strong> {user ? user.email : 'None'}
            </div>
            <div>
              <strong>Admin Profile:</strong> {adminProfile ? `${adminProfile.role} (${adminProfile.id})` : 'None'}
            </div>
            <div>
              <strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Profile Type:</strong> {adminProfile?.id.startsWith('temp-') ? 'Temporary' : adminProfile?.id.startsWith('emergency-') ? 'Emergency' : 'Database'}
            </div>
            <div>
              <strong>Active:</strong> {adminProfile?.is_active ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Admin Actions</h2>
          <div className="space-y-2">
            <a href="/admin/dashboard" className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Go to Full Dashboard
            </a>
            <a href="/admin/projects" className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Manage Projects
            </a>
            <a href="/admin/explore" className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Manage Content
            </a>
            <a href="/admin/settings" className="block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              Settings
            </a>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Debug Information</h2>
          <div className="text-sm text-gray-600">
            <p><strong>User ID:</strong> {user?.id}</p>
            <p><strong>Profile ID:</strong> {adminProfile?.id}</p>
            <p><strong>Permissions:</strong> {adminProfile?.permissions ? 'Set' : 'None'}</p>
            <p><strong>Last Login:</strong> {adminProfile?.last_login || 'Never'}</p>
            <p><strong>Created:</strong> {adminProfile?.created_at}</p>
          </div>
        </div>
      </div>
    </div>
  )
}