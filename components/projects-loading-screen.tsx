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
    // Timer to complete loading after specified duration
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, duration)

    return () => {
      clearTimeout(timer);
    }
  }, [duration, onComplete])

  if (!isVisible) {
    return null
  }
  
  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center">
        <Image 
          src="/Project_loading.gif" 
          alt="Loading projects..." 
          width={150}
          height={150}
          className="object-contain"
          unoptimized
          priority
        />
      </div>
    </div>
  )
} 