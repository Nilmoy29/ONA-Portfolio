"use client"
import { useEffect, useState } from "react"
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

  useEffect(() => {
    setIsMobile(detectIsMobile())
  }, [])

  if (isMobile === null) {
    return <div className="relative w-full h-screen bg-black" />
  }

  const gifSrc = isMobile ? "/HeroLoading.gif" : "/HeroLoading2.gif"

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 pt-12 md:pt-16">
        <Image
          src={gifSrc}
          alt="Hero animation"
          fill
          priority
          unoptimized
          className="object-cover"
        />
      </div>
    </section>
  )
}
