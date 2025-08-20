"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { fetchWithRetry } from "@/lib/network-utils"
import { Card, CardContent } from "@/components/ui/card"
import { Move } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

// Fallback partners data for when Supabase is not available
const fallbackPartners = [
  { name: "Sustainable Design Institute", logo: "/placeholder.svg?height=80&width=160" },
  { name: "Indigenous Architecture Council", logo: "/placeholder.svg?height=80&width=160" },
  { name: "Green Building Alliance", logo: "/placeholder.svg?height=80&width=160" },
  { name: "Cultural Heritage Foundation", logo: "/placeholder.svg?height=80&width=160" },
  { name: "Environmental Design Group", logo: "/placeholder.svg?height=80&width=160" },
  { name: "Community Development Partners", logo: "/placeholder.svg?height=80&width=160" },
  { name: "Sustainable Materials Co.", logo: "/placeholder.svg?height=80&width=160" },
  { name: "Native Arts Collective", logo: "/placeholder.svg?height=80&width=160" },
]

export function PartnersSection() {
  const [partners, setPartners] = useState(fallbackPartners)
  const [loading, setLoading] = useState(true)
  const [api, setApi] = useState<CarouselApi | undefined>(undefined)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [dotCount, setDotCount] = useState(0)

  // Fetch partners via Next.js API
  useEffect(() => {
    async function fetchPartners() {
      try {
        setLoading(true)
        const response = await fetchWithRetry('/api/public/partners', { cache: 'no-store' }, { maxRetries: 2, baseDelay: 700, maxDelay: 2000 })
        const json = await response.json()

        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          const transformedPartners = json.data.map((partner: any) => ({
            name: partner.name,
            logo: partner.logo_url || "/placeholder.svg?height=80&width=160",
          }))
          setPartners(transformedPartners)
        }
      } catch (error) {
        console.warn('⏱️ Partners API issue, using fallback. Reason:', (error as any)?.message || error)
        // Keep fallback data on error
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  useEffect(() => {
    if (!api) return
    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap())
    }
    setDotCount(api.scrollSnapList().length)
    onSelect()
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api])

  return (
    <section className="py-12 sm:py-16 bg-black text-white relative overflow-hidden">
      {/* Background gradient for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-black/80"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 transition-all duration-500 hover:text-transparent hover:[-webkit-text-stroke:1px_white] group">
            <span className="text-white group-hover:text-transparent group-hover:[-webkit-text-stroke:1px_white]">Our</span>
            {" "}
            <span className="text-zinc-400 group-hover:text-transparent group-hover:[-webkit-text-stroke:1px_white]">Allies</span>
          </h2>
          <p className="text-lg sm:text-xl text-zinc-300 font-light max-w-2xl mx-auto px-4 sm:px-0">
            We collaborate with leading organizations that share our commitment to sustainable design and cultural
            preservation.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16 sm:py-20">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* Partners Carousel */}
        {!loading && (
          <div className="relative">
            {/* Mobile Swipe Instruction - Always visible on mobile */}
            <div className="sm:hidden flex items-center justify-center mb-6">
              <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-700 rounded-full px-4 py-2">
                <Move className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">Swipe to explore partners</span>
              </div>
            </div>

            {/* Carousel Container */}
            <div className="relative rounded-3xl p-4 sm:p-6 md:p-8 bg-zinc-950/60 border border-zinc-800 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] backdrop-blur-sm">
              <Carousel
                setApi={setApi}
                className="w-full"
                opts={{ 
                  align: "start", 
                  loop: true, 
                  dragFree: true,
                  slidesToScroll: 1,
                  containScroll: "trimSnaps",
                  // Mobile-optimized: scroll by 1 item at a time
                  skipSnaps: false
                }}
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {partners.map((partner, index) => (
                    <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/3 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <Card className="border-zinc-800 bg-zinc-900/80 hover:bg-zinc-900 hover:border-zinc-600 transition-all duration-300 group">
                        <CardContent className="p-3 sm:p-4 md:p-6 h-28 sm:h-32 md:h-36 flex items-center justify-center">
                          <div className="relative w-full h-full rounded-xl p-2 sm:p-3 md:p-4">
                            <Image
                              src={partner.logo || "/placeholder.svg"}
                              alt={partner.name}
                              fill
                              sizes="(max-width: 640px) 30vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw"
                              className="object-contain"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Desktop Navigation Buttons */}
                <div className="hidden md:block">
                  <CarouselPrevious className="-left-6 top-1/2 -translate-y-1/2 bg-zinc-900/90 border-zinc-700 text-white shadow-md hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-200" />
                  <CarouselNext className="-right-6 top-1/2 -translate-y-1/2 bg-zinc-900/90 border-zinc-700 text-white shadow-md hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-200" />
                </div>

                {/* Mobile Navigation Dots */}
                <div className="md:hidden mt-6 flex items-center justify-center gap-2">
                  {Array.from({ length: dotCount }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => api?.scrollTo(i)}
                      className={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${
                        selectedIndex === i 
                          ? "bg-white scale-110" 
                          : "bg-zinc-600 hover:bg-zinc-500"
                      }`}
                      aria-label={`Go to partner ${i + 1}`}
                    />
                  ))}
                </div>
              </Carousel>

              {/* Mobile Touch Indicators */}
              <div className="sm:hidden absolute inset-0 pointer-events-none">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-zinc-900/90 to-transparent rounded-l-full"></div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-l from-zinc-900/90 to-transparent rounded-r-full"></div>
              </div>
            </div>

            {/* Mobile Navigation Instructions */}
            <div className="sm:hidden mt-4 text-center">
              <p className="text-sm text-zinc-400">
                Use the dots below or swipe to navigate
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
