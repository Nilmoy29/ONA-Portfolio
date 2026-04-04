import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oscicdyjpnnykyqpvuys.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY2ljZHlqcG5ueWt5cXB2dXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjE3OTcsImV4cCI6MjA2NzkzNzc5N30.IJrRjFZqKHejoM0GS6y0l50OXDmsoJRhVXINixJyB8E'

// HMR-safe singletons to avoid multiple GoTrueClient instances in the browser
const globalForSupabase = globalThis as unknown as {
  __supabase?: SupabaseClient
  __supabaseAdmin?: SupabaseClient
}

if (!globalForSupabase.__supabase) {
  console.log('🔧 Creating new Supabase client instance')
  globalForSupabase.__supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'ona-admin-auth'
    }
  })
}

export const supabase = globalForSupabase.__supabase

// Admin client for server-side operations (only used in API routes)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zY2ljZHlqcG5ueWt5cXB2dXlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM2MTc5NywiZXhwIjoyMDY3OTM3Nzk3fQ.RFGdVve9Gq9I19YKsDSBmKIFSEJDi0141l5JkbkFQgI'

// Create admin client only on the server to avoid multiple GoTrueClient instances in the browser
export const supabaseAdmin: SupabaseClient = (typeof window === 'undefined')
  ? createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  // Type cast for client-side where this should never be used
  : (undefined as unknown as SupabaseClient)