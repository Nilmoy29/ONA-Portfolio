"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Simplified and more reliable mobile detection
    const checkDeviceAndOrientation = () => {
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      const isPortrait = screenHeight > screenWidth
      
      // More liberal mobile detection - anything under 1024px width and in portrait
      const isMobileDevice = screenWidth < 1024
      const shouldShowPortrait = isMobileDevice && isPortrait
      
      console.log('Loading Screen Debug:', {
        screenWidth,
        screenHeight,
        isPortrait,
        isMobileDevice,
        shouldShowPortrait,
        currentGif: shouldShowPortrait ? 'portrait' : 'landscape'
      })
      
      setIsMobile(shouldShowPortrait)
    }

    // Check immediately
    checkDeviceAndOrientation()

    // Listen for changes
    window.addEventListener('resize', checkDeviceAndOrientation)
    window.addEventListener('orientationchange', () => {
      // Add delay for orientation change to complete
      setTimeout(checkDeviceAndOrientation, 100)
    })

    return () => {
      window.removeEventListener('resize', checkDeviceAndOrientation)
      window.removeEventListener('orientationchange', checkDeviceAndOrientation)
    }
  }, [mounted])

  useEffect(() => {
    // Start timer immediately - don't wait for mounted state
    console.log('Starting loading timer for 4 seconds')
    const timer = setTimeout(() => {
      console.log('Loading screen timer completed after 4 seconds')
      onComplete()
    }, 4000) // 4 seconds total

    return () => {
      console.log('Cleaning up loading timer')
      clearTimeout(timer)
    }
  }, [onComplete])

  // Show loading screen even before mounted to prevent flash
  if (!mounted) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <Image 
          src="/loading_animation.gif"
          alt="Loading..." 
          fill
          className="object-cover"
          unoptimized
          priority
        />
      </div>
    )
  }

  const gifSrc = isMobile ? "/loading_animation_portrait.gif" : "/loading_animation.gif"
  console.log('Rendering with GIF:', gifSrc)

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <Image 
        src={gifSrc}
        alt="Loading..." 
        fill
        className="object-cover"
        unoptimized
        priority
      />
    </div>
  )
}
