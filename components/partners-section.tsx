"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

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

  // Fetch partners from Supabase
  useEffect(() => {
    async function fetchPartners() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true })

        if (error) {
          console.error('Error fetching partners:', error)
          // Keep fallback data on error
          return
        }

        if (data && data.length > 0) {
          // Transform Supabase data to match component expectations
          const transformedPartners = data.map((partner) => ({
            name: partner.name,
            logo: partner.logo_url || "/placeholder.svg?height=80&width=160",
          }))
          setPartners(transformedPartners)
        }
      } catch (error) {
        console.error('Error fetching partners:', error)
        // Keep fallback data on error
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  return (
    <section className="py-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl lg:text-6xl font-light text-white mb-6">
            Partners & <span className="text-[#ff6b00]">Allies</span>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="group flex items-center justify-center p-6 bg-white/10 backdrop-blur-md border border-white/20 hover:border-[#ff6b00]/60 transition-all duration-300 rounded-2xl hover:bg-[#ff6b00]/10"
              >
                <img
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  className="max-w-full h-12 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300 filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
