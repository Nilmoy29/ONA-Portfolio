"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

interface LoadingScreenProps {
  onComplete: () => void
}

function detectIsMobile(): boolean {
  if (typeof window === "undefined") return false

  // More comprehensive mobile detection
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || ""
  
  // Check for mobile user agents
  const uaIndicatesMobile = /Android|iPhone|iPad|iPod|Windows Phone|IEMobile|BlackBerry|webOS|Opera Mini|Mobile|CriOS|FxiOS/i.test(userAgent)
  
  // Check for touch capability (mobile devices typically have touch)
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  // Check screen width (mobile breakpoint)
  const widthIndicatesMobile = window.innerWidth < 1024
  
  // Check for mobile-specific features
  const isMobileDevice = /Android|iPhone|iPad|iPod|Windows Phone/i.test(userAgent)
  
  // More conservative mobile detection - if any strong indicators exist, treat as mobile
  return uaIndicatesMobile || (hasTouch && widthIndicatesMobile) || isMobileDevice
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  // Choose after hydration to avoid SSR/client mismatch; keep stable for the whole 3s
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [gifReady, setGifReady] = useState(false)
  const timerRef = useRef<number | null>(null)
  const fallbackTimerRef = useRef<number | null>(null)
  const completedRef = useRef(false)

  useEffect(() => {
    const detectedMobile = detectIsMobile()
    setIsMobile(detectedMobile)
    setStartTime(Date.now())
    
    console.log('LoadingScreen: Mobile detected:', detectedMobile)
    console.log('LoadingScreen: GIF source will be:', detectedMobile ? "/loading_animation_portrait.gif" : "/loading_animation.gif")
    
    // Fallback timer to ensure loading screen completes even if GIF fails
    fallbackTimerRef.current = window.setTimeout(() => {
      if (!completedRef.current) {
        console.log('LoadingScreen: Fallback timer triggered')
        completedRef.current = true
        onComplete()
      }
    }, 5000) // 5 second fallback
  }, [onComplete])

  // Clear timers if unmounted
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current)
      }
    }
  }, [])

  // Handle completion logic with minimum display time
  useEffect(() => {
    if (!gifReady || !startTime) return

    const elapsed = Date.now() - startTime
    const minimumDisplayTime = 3000 // 3 seconds minimum
    const remainingTime = Math.max(0, minimumDisplayTime - elapsed)

    console.log('LoadingScreen: Timer logic - elapsed:', elapsed, 'ms, remaining:', remainingTime, 'ms')

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Set timer for remaining time to ensure minimum 3 seconds
    timerRef.current = window.setTimeout(() => {
      if (!completedRef.current) {
        console.log('LoadingScreen: Minimum display time completed, calling onComplete')
        completedRef.current = true
        // Clear fallback timer since we're completing normally
        if (fallbackTimerRef.current) {
          clearTimeout(fallbackTimerRef.current)
        }
        onComplete()
      }
    }, remainingTime)
  }, [gifReady, startTime, onComplete])

  if (isMobile === null) {
    return <div className="fixed inset-0 z-50 bg-black" />
  }

  const gifSrc = isMobile ? "/loading_animation_portrait.gif" : "/loading_animation.gif"
  
  // Log the final GIF selection for debugging
  console.log('LoadingScreen: Final GIF selected:', gifSrc)

  const handleImageLoaded = () => {
    console.log('LoadingScreen: Image loaded, starting GIF render delay...')
    // Mark image as loaded
    setImageLoaded(true)
    
    // Add a delay to ensure GIF is properly rendered and visible
    // This gives the browser time to fully render the animation
    setTimeout(() => {
      console.log('LoadingScreen: GIF ready, starting minimum display timer...')
      setGifReady(true)
    }, 300) // Increased delay to ensure proper GIF rendering
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <Image
        src={gifSrc}
        alt="Loading..."
        fill
        className="object-cover"
        unoptimized
        priority
        onLoadingComplete={handleImageLoaded}
      />
    </div>
  )
}
