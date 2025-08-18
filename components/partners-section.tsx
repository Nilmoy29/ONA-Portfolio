"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { fetchWithRetry } from "@/lib/network-utils"
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
    <section className="py-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 transition-all duration-500 hover:text-transparent hover:[-webkit-text-stroke:1px_white] group">
            <span className="text-white group-hover:text-transparent group-hover:[-webkit-text-stroke:1px_white]">Our</span>
            {" "}
            <span className="text-zinc-400 group-hover:text-transparent group-hover:[-webkit-text-stroke:1px_white]">Allies</span>
          </h2>
          <p className="text-xl text-zinc-300 font-light max-w-2xl mx-auto">
            We collaborate with leading organizations that share our commitment to sustainable design and cultural
            preservation.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {!loading && (
          <div className="relative rounded-3xl p-6 md:p-8 bg-zinc-950/60 border border-zinc-800 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]">
            <Carousel
              setApi={setApi}
              className="w-full"
              opts={{ align: "start", loop: true, dragFree: false }}
            >
              <CarouselContent>
                {partners.map((partner, index) => (
                  <CarouselItem key={index} className="basis-1/1 sm:basis-1/2 lg:basis-1/4">
                    <div
                      className="group m-2 flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm p-6 h-28 md:h-36 hover:border-white/60 transition-all duration-300"
                      aria-label={partner.name}
                    >
                      <div className="relative w-full h-full rounded-xl bg-white p-3 md:p-4">
                        <Image
                          src={partner.logo || "/placeholder.svg"}
                          alt={partner.name}
                          fill
                          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 top-1/2 -translate-y-1/2 bg-zinc-900/90 border-zinc-700 text-white shadow-md hover:bg-zinc-800" />
              <CarouselNext className="-right-4 top-1/2 -translate-y-1/2 bg-zinc-900/90 border-zinc-700 text-white shadow-md hover:bg-zinc-800" />
            </Carousel>

            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: dotCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className={`h-2.5 w-2.5 rounded-full transition-opacity ${
                    selectedIndex === i ? "bg-white opacity-100" : "bg-zinc-600 opacity-70"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
