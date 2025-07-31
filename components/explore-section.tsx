"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowUpRight, FileText, Camera, Palette, BookOpen } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { ExploreContentModal } from "./explore-content-modal"

// Fallback explore content for when Supabase is not available
const fallbackExploreContent = {
  "Visual Articles": [
    {
      id: 1,
      title: "The Future of Indigenous Architecture",
      slug: "future-of-indigenous-architecture",
      excerpt: "Exploring how traditional building methods inform contemporary sustainable design",
      image: "/placeholder.svg?height=300&width=400",
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Biophilic Design in Urban Environments",
      slug: "biophilic-design-urban-environments",
      excerpt: "Integrating natural elements into city architecture for human wellbeing",
      image: "/placeholder.svg?height=300&width=400",
      date: "2024-01-10",
    },
  ],
  "Artwork Showcase": [
    {
      id: 3,
      title: "Geometric Interpretations",
      slug: "geometric-interpretations",
      excerpt: "Abstract representations of traditional architectural forms",
      image: "/placeholder.svg?height=300&width=400",
      date: "2024-01-12",
    },
    {
      id: 4,
      title: "Cultural Patterns in Modern Context",
      slug: "cultural-patterns-modern-context",
      excerpt: "Contemporary art inspired by indigenous design motifs",
      image: "/placeholder.svg?height=300&width=400",
      date: "2024-01-08",
    },
  ],
  Research: [
    {
      id: 5,
      title: "Sustainable Materials in Traditional Construction",
      slug: "sustainable-materials-traditional-construction",
      excerpt: "Academic research on eco-friendly building materials used by indigenous communities",
      image: "/placeholder.svg?height=300&width=400",
      date: "2024-01-05",
    },
    {
      id: 6,
      title: "Climate-Responsive Architecture",
      slug: "climate-responsive-architecture",
      excerpt: "Study on traditional building techniques for modern climate challenges",
      image: "/placeholder.svg?height=300&width=400",
      date: "2024-01-01",
    },
  ],
  Photography: [
    {
      id: 7,
      title: "Architectural Details",
      slug: "architectural-details",
      excerpt: "Capturing the intricate details of our completed projects",
      image: "/placeholder.svg?height=300&width=400",
      date: "2024-01-14",
    },
    {
      id: 8,
      title: "Construction Process",
      slug: "construction-process",
      excerpt: "Behind-the-scenes documentation of our building process",
      image: "/placeholder.svg?height=300&width=400",
      date: "2024-01-11",
    },
  ],
}

const tabs = [
  { name: "Visual Articles", icon: FileText },
  { name: "Artwork Showcase", icon: Palette },
  { name: "Research", icon: BookOpen },
  { name: "Photography", icon: Camera },
]

export function ExploreSection() {
  const [activeTab, setActiveTab] = useState("Visual Articles")
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [exploreContent, setExploreContent] = useState(fallbackExploreContent)
  const [loading, setLoading] = useState(true)
  const [selectedContentSlug, setSelectedContentSlug] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch explore content from Supabase
  useEffect(() => {
    async function fetchExploreContent() {
      try {
        setLoading(true)
        console.log('🔍 Fetching explore content...')
        const { data, error } = await supabase
          .from('explore_content')
          .select('id, title, slug, content_type, excerpt, content, featured_image_url, is_published, created_at')
          .eq('is_published', true)
          .order('created_at', { ascending: false })

        console.log('🔍 Supabase response:', { data, error, hasData: !!data, dataLength: data?.length })

        if (error) {
          console.error('❌ Error fetching explore content:')
          console.error('Full error object:', error)
          console.error('Error message:', error.message)
          console.error('Error code:', error.code)
          console.error('Error details:', error.details)
          console.error('Error hint:', error.hint)
          console.error('Error stringified:', JSON.stringify(error, null, 2))
          // Keep fallback data on error
          return
        }

        if (data && data.length > 0) {
          console.log('✅ Successfully fetched', data.length, 'explore content items')
          // Group content by type and transform for component
          const groupedContent: typeof fallbackExploreContent = {
            "Visual Articles": [],
            "Artwork Showcase": [],
            "Research": [],
            "Photography": []
          }

          // Transform Supabase data
          data.forEach((item) => {
            const transformedItem = {
              id: item.id,
              title: item.title,
              slug: item.slug,
              excerpt: item.excerpt || "",
              image: item.featured_image_url || "/placeholder.svg?height=300&width=400",
              date: new Date(item.created_at || Date.now()).toLocaleDateString()
            }

            // Map content types to display categories
            const typeMapping: Record<string, keyof typeof groupedContent> = {
              "article": "Visual Articles",
              "artwork": "Artwork Showcase", 
              "research": "Research",
              "photography": "Photography"
            }

            const displayType = typeMapping[item.content_type || "article"] || "Visual Articles"
            groupedContent[displayType].push(transformedItem)
          })

          setExploreContent(groupedContent)
        } else {
          console.log('⚠️ No explore content found or empty data array')
        }
      } catch (error) {
        console.error('💥 Exception in fetchExploreContent:', error)
        console.error('Exception type:', typeof error)
        console.error('Exception stringified:', JSON.stringify(error, null, 2))
        // Keep fallback data on error
      } finally {
        setLoading(false)
      }
    }

    fetchExploreContent()
  }, [])

  const handleContentClick = (slug: string) => {
    setSelectedContentSlug(slug)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedContentSlug(null)
  }

  return (
    <section id="explore" className="py-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-5xl lg:text-6xl font-light text-white mb-6">
            ONA <span className="text-[#ff6b00]">Explore</span>
          </h2>
          <p className="text-xl text-zinc-300 font-light max-w-3xl">
            Dive deeper into our creative process, research, and artistic explorations. Discover the stories,
            inspirations, and innovations that drive our architectural practice.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-10 border-b border-white/20">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-light tracking-wider uppercase transition-all duration-300 border-b-2 ${
                  activeTab === tab.name
                    ? "border-[#ff6b00] text-[#ff6b00]"
                    : "border-transparent text-zinc-400 hover:text-[#ff6b00]"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </div>

        {/* Content Grid - Full Width Layout */}
        <div className="space-y-8">
          {exploreContent[activeTab as keyof typeof exploreContent]?.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:border-[#ff6b00]/60 transition-all duration-500 hover:bg-white/15"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => item.slug && handleContentClick(item.slug)}
            >
              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="relative lg:w-1/3 h-64 lg:h-80 overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    width={500}
                    height={320}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-500 ${
                      hoveredItem === item.id ? "opacity-100" : "opacity-80"
                    }`}
                  />
                  <div
                    className={`absolute top-6 right-6 p-3 bg-[#ff6b00]/30 backdrop-blur-sm rounded-full border border-[#ff6b00]/30 transition-all duration-500 ${
                      hoveredItem === item.id ? "opacity-100 translate-x-0 scale-110" : "opacity-0 translate-x-4"
                    }`}
                  >
                    <ArrowUpRight className="h-5 w-5 text-[#ff6b00]" />
                  </div>
                  
                  {/* Content Type Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-black rounded-full">
                      {activeTab}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-zinc-400 font-light">
                        {new Date(item.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-xs text-zinc-500 uppercase tracking-wide">Featured</span>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl lg:text-3xl font-light text-white group-hover:text-zinc-200 transition-colors duration-300 leading-tight">
                      {item.title}
                    </h3>
                    
                    <p className="text-zinc-300 font-light leading-relaxed text-lg line-clamp-3">
                      {item.excerpt}
                    </p>
                    
                    <div className="pt-6">
                      <motion.div 
                        className="inline-flex items-center text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        Read More
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hover Effect Border */}
              <motion.div
                className="absolute inset-0 border-2 border-blue-400/0 rounded-2xl transition-all duration-300 pointer-events-none"
                animate={{
                  borderColor: hoveredItem === item.id ? "rgb(96 165 250 / 0.3)" : "rgb(96 165 250 / 0)"
                }}
              />
            </motion.div>
          ))}
        </div>

      {/* Explore Content Modal */}
      <ExploreContentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        slug={selectedContentSlug}
      />
      </div>
    </section>
  )
}
