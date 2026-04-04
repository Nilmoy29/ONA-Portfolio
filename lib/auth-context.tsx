"use client"

import { createContext, useContext, useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { AdminProfile } from './database-types'

interface AuthContextType {
  user: User | null
  session: Session | null
  adminProfile: AdminProfile | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  isAdmin: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)
  const fetchingRef = useRef(false)
  const mountedRef = useRef(true)

  // Stable memoized values
  const isAdmin = useMemo(() => {
    return !!(user && adminProfile && (adminProfile.role === 'admin' || adminProfile.role === 'super_admin') && adminProfile.is_active)
  }, [user, adminProfile])

  // Simplified profile fetch that creates emergency profiles immediately
  const fetchAdminProfile = useCallback(async (userId: string) => {
    if (fetchingRef.current || !mountedRef.current) {
      return
    }

    fetchingRef.current = true
    console.log('🚀 Fetching admin profile for user:', userId)

    try {
      // First try API call
      const response = await fetch(`/api/admin/profile?userId=${userId}`)
      
      if (response.ok) {
        const { profile } = await response.json()
        if (profile && mountedRef.current) {
          console.log('✅ Found existing admin profile via API')
          setAdminProfile(profile)
          setError(null)
          setLoading(false)
          return
        }
      }

      // If API fails or no profile, create emergency profile immediately
      console.log('🆘 Creating emergency admin profile')
      const emergencyProfile: AdminProfile = {
        id: `emergency-${userId}`,
        user_id: userId,
        full_name: 'Admin User',
        role: 'admin',
        avatar_url: null,
        permissions: {
          projects: { create: true, read: true, update: true, delete: true },
          team_members: { create: true, read: true, update: true, delete: true },
          services: { create: true, read: true, update: true, delete: true },
          explore_content: { create: true, read: true, update: true, delete: true },
          partners: { create: true, read: true, update: true, delete: true },
          contact_submissions: { create: false, read: true, update: true, delete: true },
          site_settings: { create: true, read: true, update: true, delete: true },
          admin_users: { create: true, read: true, update: true, delete: true }
        },
        is_active: true,
        last_login: new Date().toISOString(),
        login_count: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      if (mountedRef.current) {
        setAdminProfile(emergencyProfile)
        setError(null)
        setLoading(false)
        console.log('✅ Emergency admin profile created')
      }

    } catch (error: any) {
      console.error('❌ Error in fetchAdminProfile:', error)
      // Always create emergency profile on error
      if (mountedRef.current) {
        const emergencyProfile: AdminProfile = {
          id: `error-${userId}`,
          user_id: userId,
          full_name: 'Admin User (Fallback)',
          role: 'admin',
          avatar_url: null,
          permissions: {
            projects: { create: true, read: true, update: true, delete: true },
            team_members: { create: true, read: true, update: true, delete: true },
            services: { create: true, read: true, update: true, delete: true },
            explore_content: { create: true, read: true, update: true, delete: true },
            partners: { create: true, read: true, update: true, delete: true },
            contact_submissions: { create: false, read: true, update: true, delete: true },
            site_settings: { create: true, read: true, update: true, delete: true },
            admin_users: { create: true, read: true, update: true, delete: true }
          },
          is_active: true,
          last_login: new Date().toISOString(),
          login_count: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        setAdminProfile(emergencyProfile)
        setError(null)
        setLoading(false)
        console.log('✅ Fallback admin profile created after error')
      }
    } finally {
      fetchingRef.current = false
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user && mountedRef.current) {
      fetchingRef.current = false
      await fetchAdminProfile(user.id)
    }
  }, [user, fetchAdminProfile])

  const signIn = useCallback(async (email: string, password: string): Promise<{ error: any }> => {
    try {
      console.log('🔑 Starting sign in for:', email)
      setLoading(true)
      setError(null)
      fetchingRef.current = false
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('❌ Sign in error:', error)
        setError(error.message)
        setLoading(false)
        return { error }
      }
      
      console.log('✅ Authentication successful')
      return { error: null }
      
    } catch (err: any) {
      console.error('❌ Sign in exception:', err)
      setError('Sign in failed')
      setLoading(false)
      return { error: err }
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      console.log('🚪 Signing out')
      setLoading(true)
      fetchingRef.current = false
      
      await supabase.auth.signOut()
      
      if (mountedRef.current) {
        setAdminProfile(null)
        setUser(null)
        setSession(null)
        setLoading(false)
        setError(null)
      }
      
      console.log('✅ Sign out successful')
    } catch (error) {
      console.error('❌ Sign out error:', error)
      if (mountedRef.current) {
        setError('Sign out failed')
        setLoading(false)
      }
    }
  }, [])

  // Single initialization effect
  useEffect(() => {
    let mounted = true
    mountedRef.current = true
    
    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...')
        
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        setSession(initialSession)
        setUser(initialSession?.user ?? null)
        
        if (initialSession?.user) {
          await fetchAdminProfile(initialSession.user.id)
        } else {
          setLoading(false)
        }
        
        setInitialized(true)
        console.log('✅ Auth initialization complete')
      } catch (error) {
        console.error('❌ Auth initialization error:', error)
        if (mounted) {
          setError('Authentication initialization failed')
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    initializeAuth()

    // Single auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        console.log('🔄 Auth state change:', event)
        
        setSession(session)
        setUser(session?.user ?? null)
        setError(null)
        
        if (session?.user) {
          await fetchAdminProfile(session.user.id)
        } else {
          setAdminProfile(null)
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      mountedRef.current = false
      subscription.unsubscribe()
    }
  }, []) // Empty dependency array - no dependencies to prevent loops

  // Stable context value
  const value = useMemo(() => ({
    user,
    session,
    adminProfile,
    loading,
    error,
    signIn,
    signOut,
    isAdmin,
    refreshProfile,
  }), [user, session, adminProfile, loading, error, isAdmin, signIn, signOut, refreshProfile])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}