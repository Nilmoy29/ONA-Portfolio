"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, LogIn, RefreshCw } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@ona.com')
  const [password, setPassword] = useState('admin123456')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  
  const { signIn, loading: authLoading, isAdmin, error: authError } = useAuth()
  const router = useRouter()
  const redirectRef = useRef(false)

  // Handle mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if already authenticated - only once
  useEffect(() => {
    if (!mounted || authLoading || redirectRef.current) return
    
    if (isAdmin) {
      console.log('✅ Already authenticated, redirecting to admin home')
      redirectRef.current = true
      
      // Use router.replace to prevent adding to history
      router.replace('/admin')
    }
  }, [mounted, authLoading, isAdmin, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading || redirectRef.current) return
    
    setLoading(true)
    setError('')

    try {
      console.log('🔄 Attempting login for:', email)
      const { error } = await signIn(email, password)
      
      if (error) {
        console.error('❌ Login failed:', error)
        setError(error.message || 'Failed to sign in')
        setLoading(false)
      } else {
        console.log('✅ Login successful! Redirecting to admin home...')
        redirectRef.current = true
        // The useEffect above will handle the redirect when isAdmin becomes true
      }
    } catch (err: any) {
      console.error('❌ Login exception:', err)
      setError(err.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return null
  }

  // Show loading if auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto"></div>
          <p className="mt-4 text-zinc-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If already authenticated, show redirecting message
  if (isAdmin || redirectRef.current) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto"></div>
          <p className="mt-4 text-zinc-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Sign in to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {(error || authError) && (
              <Alert variant="destructive">
                <AlertDescription>{error || authError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ona.com"
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-zinc-600">
            <p>Default credentials:</p>
            <p className="font-mono">admin@ona.com / admin123456</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}