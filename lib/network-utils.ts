// Network utilities for handling intermittent connection issues

export interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  backoffFactor?: number
}

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2
}

/**
 * Check if an error is a network-related error that might benefit from retrying
 */
export function isNetworkError(error: any): boolean {
  if (!error) return false
  
  const errorMessage = error.message?.toLowerCase() || ''
  const errorName = error.name?.toLowerCase() || ''
  
  // Common network error patterns
  const networkErrorPatterns = [
    'failed to fetch',
    'network request failed',
    'network error',
    'quic_protocol_error',
    'connection_refused',
    'timeout',
    'net::err_',
    'fetch error',
    'request failed'
  ]
  
  // Check error message
  const hasNetworkMessage = networkErrorPatterns.some(pattern => 
    errorMessage.includes(pattern)
  )
  
  // Check error types
  const isNetworkType = errorName === 'typeerror' || 
                       errorName === 'networkerror' ||
                       error.code === 'NETWORK_ERROR'
  
  // Check if it's a fetch-related error
  const isFetchError = error instanceof TypeError && errorMessage.includes('fetch')
  
  return hasNetworkMessage || isNetworkType || isFetchError
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = DEFAULT_RETRY_OPTIONS.maxRetries!,
    baseDelay = DEFAULT_RETRY_OPTIONS.baseDelay!,
    maxDelay = DEFAULT_RETRY_OPTIONS.maxDelay!,
    backoffFactor = DEFAULT_RETRY_OPTIONS.backoffFactor!
  } = options

  let lastError: any
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: unknown) {
      lastError = error
      
      // Don't retry if it's not a network error
      if (!isNetworkError(error)) {
        throw error
      }
      
      // Don't retry if we've reached max attempts
      if (attempt === maxRetries) {
        console.error(`❌ Max retries (${maxRetries}) exceeded. Final error:`, error)
        throw error
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt), maxDelay)
      
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.warn(`🔄 Network error (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${delay}ms...`, errorMessage)
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError
}

/**
 * Enhanced fetch with automatic retry for network errors
 */
export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  retryOptions?: RetryOptions
): Promise<Response> {
  return retryWithBackoff(async () => {
    const response = await fetch(input, init)
    
    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    return response
  }, retryOptions)
}

/**
 * Enhanced Supabase query with automatic retry
 */
export async function supabaseQueryWithRetry<T>(
  queryFn: () => Promise<{ data: T | null, error: any }>,
  retryOptions?: RetryOptions
): Promise<{ data: T | null, error: any }> {
  return retryWithBackoff(async () => {
    const result = await queryFn()
    
    // If there's an error, check if it's network-related
    if (result.error) {
      if (isNetworkError(result.error)) {
        throw new Error(`Supabase error: ${result.error.message || result.error}`)
      } else {
        // Non-network errors should be returned, not thrown
        return result
      }
    }
    
    return result
  }, retryOptions)
}

/**
 * Log network status for debugging
 */
export function logNetworkStatus() {
  if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
    console.log(`🌐 Network status: ${navigator.onLine ? 'Online' : 'Offline'}`)
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('🌐 Network status changed: Online')
    })
    
    window.addEventListener('offline', () => {
      console.log('🌐 Network status changed: Offline')
    })
  }
}

/**
 * Check if the current environment might have network issues
 */
export function detectPotentialNetworkIssues(): string[] {
  const issues: string[] = []
  
  if (typeof navigator !== 'undefined') {
    // Check if offline
    if (!navigator.onLine) {
      issues.push('Device appears to be offline')
    }
    
    // Check connection type if available
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    if (connection) {
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        issues.push('Slow network connection detected')
      }
      
      if (connection.saveData) {
        issues.push('Data saver mode is enabled')
      }
    }
  }
  
  return issues
} 