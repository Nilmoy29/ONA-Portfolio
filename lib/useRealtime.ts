import { useEffect, useState, useRef } from 'react'
import { supabase } from './supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimeOptions {
  table: string
  filter?: string
  onInsert?: (payload: any) => void
  onUpdate?: (payload: any) => void
  onDelete?: (payload: any) => void
  enabled?: boolean
}

export function useRealtime({
  table,
  filter,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true
}: UseRealtimeOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!enabled || !table) return

    // Create channel name with optional filter
    const channelName = filter ? `${table}_${filter}` : table
    
    console.log(`🔄 Setting up realtime subscription for: ${channelName}`)

    // Create channel
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          ...(filter && { filter })
        },
        (payload) => {
          console.log(`📡 Realtime event for ${table}:`, payload)
          
          switch (payload.eventType) {
            case 'INSERT':
              onInsert?.(payload)
              break
            case 'UPDATE':
              onUpdate?.(payload)
              break
            case 'DELETE':
              onDelete?.(payload)
              break
          }
        }
      )
      .subscribe((status) => {
        console.log(`📡 Realtime status for ${table}:`, status)
        setIsConnected(status === 'SUBSCRIBED')
      })

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        console.log(`🔌 Unsubscribing from realtime: ${channelName}`)
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
        setIsConnected(false)
      }
    }
  }, [table, filter, onInsert, onUpdate, onDelete, enabled])

  return { isConnected }
}

// Specific hook for admin dashboard stats
export function useAdminStatsRealtime(onStatsChange?: () => void) {
  const tables = [
    'projects',
    'team_members',
    'services', 
    'explore_content',
    'partners',
    'contact_submissions',
    'categories'
  ]

  const connections = tables.map(table => 
    useRealtime({
      table,
      onInsert: onStatsChange,
      onUpdate: onStatsChange,
      onDelete: onStatsChange,
      enabled: !!onStatsChange
    })
  )

  const allConnected = connections.every(conn => conn.isConnected)

  return { allConnected, connectionCount: connections.filter(c => c.isConnected).length }
}

// Hook for specific table data with auto-refresh
export function useRealtimeTable<T = any>(
  table: string,
  initialData: T[] = [],
  fetchFunction?: () => Promise<void>
) {
  const [data, setData] = useState<T[]>(initialData)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleDataChange = async () => {
    if (fetchFunction && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await fetchFunction()
      } catch (error) {
        console.error(`Error refreshing ${table} data:`, error)
      } finally {
        setIsRefreshing(false)
      }
    }
  }

  const { isConnected } = useRealtime({
    table,
    onInsert: handleDataChange,
    onUpdate: handleDataChange,
    onDelete: handleDataChange,
    enabled: !!fetchFunction
  })

  return {
    data,
    setData,
    isConnected,
    isRefreshing,
    refresh: handleDataChange
  }
}

// Hook for admin activity logs realtime
export function useAdminActivityRealtime(onNewActivity?: (activity: any) => void) {
  return useRealtime({
    table: 'admin_activity_logs',
    onInsert: (payload) => {
      console.log('📝 New admin activity:', payload.new)
      onNewActivity?.(payload.new)
    },
    enabled: !!onNewActivity
  })
}

// Hook for contact submissions realtime
export function useContactSubmissionsRealtime(onNewSubmission?: (submission: any) => void) {
  return useRealtime({
    table: 'contact_submissions',
    onInsert: (payload) => {
      console.log('💌 New contact submission:', payload.new)
      onNewSubmission?.(payload.new)
    },
    enabled: !!onNewSubmission
  })
} 