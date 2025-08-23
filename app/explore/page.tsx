"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { ArrowRight, ArrowUpRight, Calendar, User, Tag, AlertCircle, Loader2, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { fetchWithRetry } from "@/lib/network-utils"
import { ProjectsLoadingScreen } from "@/components/projects-loading-screen"

export default function ExplorePage() {
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState('all')
  const [hoveredItem, setHoveredItem] = useState<string | number | null>(null)
  const [showLoadingScreen, setShowLoadingScreen] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [selectedType])

  const fetchContent = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const url = selectedType === 'all' 
        ? '/api/public/explore' 
        : `/api/public/explore?type=${selectedType}`
      
      let contentData: any[] = []
      let response: Response | null = null
      try {
        response = await fetchWithRetry(url, { cache: 'no-store' })
        if (response.ok) {
          const result = await response.json()
          contentData = result.data || []
        } else {
          // No client-side fallback to avoid QUIC issues
          if (response.status === 503 || response.status === 500) {
            // Keep empty and show error below
          } else {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
        }
      } catch (err) {
        throw err
      }

      setContent(contentData)
      
      if (contentData.length === 0) {
        setError('No content found for this category. Please check back later or try a different filter.')
      }
      
    } catch (error) {
      console.error('Error fetching content:', error)
      setError('Failed to load content. Please try refreshing the page.')
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  }

  const contentTypes = [
    { value: 'all', label: 'All Content' },
    { value: 'article', label: 'Articles' },
    { value: 'research', label: 'Research' },
    { value: 'artwork', label: 'Artwork' },
    { value: 'photography', label: 'Photography' }
  ]

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date not available'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Date not available'
    }
  }

  const getPlaceholderImage = (contentType: string) => {
    switch (contentType?.toLowerCase()) {
      case 'article':
        return '/placeholder.jpg'
      case 'research':
        return '/placeholder.jpg'
      case 'artwork':
        return '/placeholder.jpg'
      case 'photography':
        return '/placeholder.jpg'
      default:
        return '/placeholder.jpg'
    }
  }

  return (
    <>
      {/* Loading Screen - Rendered at top level to cover entire page */}
      {showLoadingScreen && (
        <ProjectsLoadingScreen 
          onComplete={() => {
            setShowLoadingScreen(false);
          }}
          duration={3000}
          title="Loading Explore Content"
          subtitle="Please wait while we fetch our content..."
        />
      )}
      
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="text-center"
            >
              <motion.h1 
                variants={itemVariants}
                className="text-6xl lg:text-7xl font-bold mb-8 transition-all duration-500 hover:text-transparent hover:[-webkit-text-stroke:1px_white] group"
              >
                <span className="text-white group-hover:text-transparent group-hover:[-webkit-text-stroke:1px_white]">Explore</span>{" "}
                <span className="text-zinc-400 group-hover:text-transparent group-hover:[-webkit-text-stroke:1px_white]">& Discover</span>
              </motion.h1>
              <motion.p 
                variants={itemVariants}
                className="text-xl text-zinc-300 font-light leading-relaxed max-w-4xl mx-auto"
              >
                Dive deep into our world of architectural thinking, cultural insights, and creative explorations. 
                Discover articles, research, artwork, and photography that inspire our design philosophy.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Content Filter */}
        <section className="pb-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
              className="flex flex-wrap justify-center gap-4 mb-16"
            >
              {contentTypes.map((type) => (
                <motion.button
                  key={type.value}
                  variants={itemVariants}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-6 py-3 font-light uppercase tracking-wider transition-all duration-300 border ${
                    selectedType === type.value
                      ? 'bg-white/10 text-white border-white'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:text-white hover:border-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {type.label}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="pb-32 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <Loader2 className="h-12 w-12 text-white animate-spin mb-4" />
                <p className="text-xl text-zinc-300 font-light">Loading content...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <AlertCircle className="h-16 w-16 text-zinc-500 mb-4" />
                <h3 className="text-2xl font-light text-zinc-300 mb-2">No Content Available</h3>
                <p className="text-lg text-zinc-500 font-light text-center max-w-2xl">
                  {error}
                </p>
                <div className="mt-8 text-center">
                  <p className="text-zinc-600 mb-4">This could be because:</p>
                  <ul className="text-zinc-500 space-y-2 text-left">
                    <li>• No content has been published yet</li>
                    <li>• Content is still being prepared</li>
                    <li>• The selected filter has no matching content</li>
                  </ul>
                  <button
                    onClick={() => {
                      setSelectedType('all')
                      fetchContent()
                    }}
                    className="mt-6 px-6 py-3 border border-white text-white font-light uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                  >
                    Try All Content
                  </button>
                </div>
              </motion.div>
            ) : content.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <AlertCircle className="h-16 w-16 text-zinc-500 mb-4" />
                <h3 className="text-2xl font-light text-zinc-300 mb-2">No Content Found</h3>
                <p className="text-lg text-zinc-500 font-light text-center max-w-2xl">
                  We couldn't find any content matching your selection. Please try a different filter or check back later.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-10 md:space-y-12">
                {content.map((item: any, index: number) => (
                  <Link key={item.id || index} href={`/explore/${item.slug}`} className="block">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                      className="group cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:border-white/60 transition-all duration-500 hover:bg-white/15 shadow-[0_1px_0_0_rgba(255,255,255,0.06)]"
                      onMouseEnter={() => setHoveredItem(item.id || index)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className="flex flex-col lg:flex-row">
                        <div className="relative lg:w-1/3 h-64 lg:h-80 overflow-hidden">
                          <Image
                            src={item.featured_image_url || "/placeholder.svg?height=300&width=400"}
                            alt={item.title || 'Content image'}
                            width={500}
                            height={320}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div
                            className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-500 ${
                              hoveredItem === (item.id || index) ? "opacity-100" : "opacity-80"
                            }`}
                          />
                          <div
                            className={`absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 transition-all duration-500 ${
                              hoveredItem === (item.id || index) ? "opacity-100 translate-x-0 scale-110" : "opacity-0 translate-x-4"
                            }`}
                          >
                            <ArrowUpRight className="h-5 w-5 text-white" />
                          </div>
                          <div className="absolute bottom-4 left-4">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-black rounded-full capitalize">
                              {item.content_type || 'content'}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-sm text-zinc-400 font-light">
                                {formatDate(item.created_at)}
                              </span>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>
                                <span className="text-xs text-zinc-500 uppercase tracking-wide">Featured</span>
                              </div>
                            </div>

                            <h3 className="text-2xl lg:text-3xl font-bold text-white transition-all duration-300 leading-tight group-hover:text-transparent group-hover:[-webkit-text-stroke:1px_white]">
                              {item.title || 'Untitled Content'}
                            </h3>

                            <p className="text-zinc-300 font-light leading-relaxed text-lg line-clamp-3">
                              {item.excerpt || item.description || 'No description available'}
                            </p>

                            <div className="pt-6">
                              <motion.div 
                                className="inline-flex items-center text-sm font-medium text-zinc-300 group-hover:text-white transition-colors"
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2 }}
                              >
                                Read More
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-32 bg-zinc-900 text-white border-t border-zinc-800">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
              className="text-center"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-5xl lg:text-6xl font-bold mb-8 transition-all duration-500 hover:text-transparent hover:[-webkit-text-stroke:1px_white] group"
              >
                <span className="text-white group-hover:text-transparent group-hover:[-webkit-text-stroke:1px_white]">Stay</span>{" "}
                <span className="text-zinc-400 group-hover:text-transparent group-hover:[-webkit-text-stroke:1px_white]">Inspired</span>
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                className="text-xl text-zinc-300 font-light leading-relaxed max-w-3xl mx-auto mb-12"
              >
                Subscribe to our newsletter and never miss our latest insights, projects, 
                and architectural discoveries.
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="max-w-md mx-auto"
              >
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const email = formData.get('email') as string
                  
                  try {
                    const response = await fetch('/api/public/newsletter', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email })
                    })
                    
                    if (response.ok) {
                      e.currentTarget.reset()
                      alert('Successfully subscribed!')
                    } else {
                      const data = await response.json()
                      alert(data.error || 'Failed to subscribe')
                    }
                  } catch (error) {
                    alert('Failed to subscribe. Please try again.')
                  }
                }} className="flex">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    className="flex-1 bg-transparent border-b border-zinc-600 pb-4 text-lg font-light placeholder-zinc-500 focus:outline-none focus:border-white transition-colors text-white"
                    required
                  />
                  <button type="submit" className="ml-4 text-lg font-light uppercase tracking-wider border-b border-white pb-4 text-white hover:opacity-80 transition-colors">
                    Subscribe
                  </button>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-white py-12 border-t border-zinc-800">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="text-lg font-light mb-4">Office of Native Architects</h4>
                <p className="text-zinc-400 font-light text-sm leading-relaxed">
                  Creating architectural narratives that honor indigenous wisdom while embracing contemporary innovation.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-light mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                  <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="/#projects" className="hover:text-white transition-colors">Projects</a></li>
                  <li><a href="/services" className="hover:text-white transition-colors">Services</a></li>
                  <li><a href="/#contact" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-light mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-zinc-400 hover:text-white transition-colors">LinkedIn</a>
                  <a href="#" className="text-zinc-400 hover:text-white transition-colors">Instagram</a>
                  <a href="#" className="text-zinc-400 hover:text-white transition-colors">Twitter</a>
                </div>
              </div>
            </div>
            <div className="border-t border-zinc-800 pt-8 text-center text-zinc-400 text-sm">
              <p>&copy; 2024 Office of Native Architects. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}