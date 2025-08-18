"use client"

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { User, LogOut, Settings, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AdminHeader() {
  const { user, adminProfile, signOut, loading, refreshProfile } = useAuth()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    try {
      setSigningOut(true)
    await signOut()
    router.push('/admin/login')
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setSigningOut(false)
    }
  }

  const handleRefreshProfile = async () => {
    try {
      await refreshProfile()
    } catch (error) {
      console.error('Refresh profile error:', error)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-300 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Admin Panel</h1>
          <p className="text-sm text-zinc-700">
            Manage ONA portfolio website content
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin text-zinc-700" />
              <span className="text-sm text-zinc-700">Loading...</span>
            </div>
          ) : (
            <>
          <div className="text-right">
                <p className="text-sm font-semibold text-zinc-900">
                  {user?.email || 'Unknown User'}
                </p>
                <p className="text-xs text-zinc-600 capitalize">
                  {adminProfile?.role || 'No Role'}
                </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full border-zinc-300">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => router.push('/admin/profile')}>
                <Settings className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleRefreshProfile}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Profile
                  </DropdownMenuItem>
              <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="text-red-600 focus:text-red-700"
                    disabled={signingOut}
                  >
                <LogOut className="mr-2 h-4 w-4" />
                    {signingOut ? 'Signing Out...' : 'Sign Out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  )
}