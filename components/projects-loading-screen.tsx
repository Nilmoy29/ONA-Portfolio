"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface ProjectsLoadingScreenProps {
  onComplete?: () => void
  duration?: number // Duration in milliseconds
  title?: string
  subtitle?: string
  showText?: boolean
}

export function ProjectsLoadingScreen({ 
  onComplete, 
  duration = 2000,
  title = "Loading Projects",
  subtitle = "Please wait while we fetch your portfolio...",
  showText = true
}: ProjectsLoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    console.log('ProjectsLoadingScreen mounted, duration:', duration);
    
    // Timer to complete loading after specified duration
    const timer = setTimeout(() => {
      console.log('ProjectsLoadingScreen timer completed');
      setIsVisible(false)
      onComplete?.()
    }, duration)

    return () => {
      console.log('ProjectsLoadingScreen cleanup');
      clearTimeout(timer);
    }
  }, [duration, onComplete])

  if (!isVisible) {
    console.log('ProjectsLoadingScreen not visible, returning null');
    return null
  }

  console.log('ProjectsLoadingScreen rendering...');
  
  return (
    <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-lg overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center">
        <Image 
          src="/LOADINGSCREENANIMATION.gif" 
          alt="Loading projects..." 
          width={400}
          height={400}
          className="object-contain"
          unoptimized
          priority
        />
        {showText && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
            <div className="text-center text-white bg-black/20 backdrop-blur-sm px-8 py-6 rounded-lg border border-white/10 shadow-2xl">
              <h2 className="text-2xl font-light mb-3">{title}</h2>
              <p className="text-sm opacity-90 max-w-md">{subtitle}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 