"use client"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"

function detectIsMobile(): boolean {
  if (typeof window === "undefined") return false

  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera || ""
  const uaIndicatesMobile = /Android|iPhone|iPad|iPod|Windows Phone|IEMobile|BlackBerry|webOS|Opera Mini|Mobile/i.test(
    userAgent
  )

  const widthIndicatesMobile = window.innerWidth < 1024

  return uaIndicatesMobile || widthIndicatesMobile
}

export function HeroSection() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const [useVideoFallback, setUseVideoFallback] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setIsMobile(detectIsMobile())
  }, [])

  if (isMobile === null) {
    return <div className="relative w-full h-screen bg-black" />
  }

  const videoSrc = isMobile ? "/HeroLoading2.mp4" : "/HeroLoading.mp4"
  const gifSrc = isMobile ? "/HeroLoading.gif" : "/HeroLoading2.gif"

  // Prefer video (plays once with loop={false}); fallback to GIF when video is missing or fails
  const useVideo = !useVideoFallback

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 pt-12 md:pt-16">
        {useVideo ? (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            muted
            playsInline
            loop={false}
            onEnded={() => {
              // Video plays once; stays on last frame (default behavior)
            }}
            onError={() => setUseVideoFallback(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={gifSrc}
            alt="Hero animation"
            fill
            priority
            unoptimized
            className="object-cover"
            style={{ transform: "translateZ(0)" }}
          />
        )}
      </div>
    </section>
  )
}
