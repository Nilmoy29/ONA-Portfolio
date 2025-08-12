"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

interface LoadingScreenProps {
  onComplete: () => void
}

function detectIsMobile(): boolean {
  if (typeof window === "undefined") return false

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || ""
  const uaIndicatesMobile = /Android|iPhone|iPad|iPod|Windows Phone|IEMobile|BlackBerry|webOS|Opera Mini|Mobile/i.test(userAgent)

  const widthIndicatesMobile = window.innerWidth < 1024

  return uaIndicatesMobile || widthIndicatesMobile
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  // Choose after hydration to avoid SSR/client mismatch; keep stable for the whole 3s
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const timerRef = useRef<number | null>(null)
  const completedRef = useRef(false)

  useEffect(() => {
    setIsMobile(detectIsMobile())
  }, [])

  // Clear timer if unmounted
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  if (isMobile === null) {
    return <div className="fixed inset-0 z-50 bg-black" />
  }

  const gifSrc = isMobile ? "/loading_animation_portrait.gif" : "/loading_animation.gif"

  const handleImageLoaded = () => {
    if (completedRef.current) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true
        onComplete()
      }
    }, 3000)
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
