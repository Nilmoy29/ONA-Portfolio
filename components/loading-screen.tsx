"use client"

import { useEffect } from "react"
import Image from "next/image"

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  useEffect(() => {
    // Simple timer to complete loading after 3 seconds
    const timer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
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
