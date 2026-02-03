"use client"

import { useEffect, useState } from "react"

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

  useEffect(() => {
    setIsMobile(detectIsMobile())
  }, [])

  if (isMobile === null) {
    return <div className="relative w-full h-screen bg-black" />
  }

  const videoSrc = isMobile ? "/HeroLoading.mp4" : "/HeroLoading2.mp4"

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 pt-12 md:pt-16">
        <video
          src={videoSrc}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          playsInline
          loop={false}
        />
      </div>
    </section>
  )
}
