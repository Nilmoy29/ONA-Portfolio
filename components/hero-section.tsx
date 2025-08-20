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
  const [gifLoaded, setGifLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setIsMobile(detectIsMobile())
  }, [])

  const handleImageLoad = () => {
    setGifLoaded(true)
    // Ensure the GIF keeps playing by setting a flag
    if (imageRef.current) {
      imageRef.current.style.animationPlayState = 'running'
    }
  }

  if (isMobile === null) {
    return <div className="relative w-full h-screen bg-black" />
  }

  const gifSrc = isMobile ? "/HeroLoading.gif" : "/HeroLoading2.gif"

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 pt-12 md:pt-16">
        <Image
          ref={imageRef}
          src={gifSrc}
          alt="Hero animation"
          fill
          priority
          unoptimized
          className="object-cover"
          onLoad={handleImageLoad}
          style={{
            // Use CSS to ensure GIF animation continues
            animationPlayState: 'running',
            // Alternative: use transform to prevent re-render issues
            transform: 'translateZ(0)'
          }}
        />
      </div>
    </section>
  )
}
