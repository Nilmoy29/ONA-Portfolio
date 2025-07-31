"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { ArrowRight, Calendar, User, Tag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ExplorePage() {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState('all')

  useEffect(() => {
    fetchContent()
  }, [selectedType])

  const fetchContent = async () => {
    try {
      const url = selectedType === 'all' 
        ? '/api/public/explore' 
        : `/api/public/explore?type=${selectedType}`
      const response = await fetch(url)
      const data = await response.json()
      setContent(data.data || [])
    } catch (error) {
      console.error('Error fetching content:', error)
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
        ease: "easeOut"
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
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
              className="text-6xl lg:text-7xl font-light mb-8"
            >
              Explore & <span className="italic font-extralight text-[#ff6b00]">Discover</span>
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
                    ? 'bg-[#ff6b00] text-black border-[#ff6b00]'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:border-[#ff6b00] hover:text-[#ff6b00]'
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
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {content.map((item: any, index: number) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-[#ff6b00]/30 transition-all duration-300"
              >
                <Link href={`/explore/${item.slug}`}>
                  <div className="aspect-[4/3] bg-zinc-800 overflow-hidden">
                    <Image
                      src={item.featured_image_url || "/api/placeholder/400/300"}
                      alt={item.title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-6 space-y-3">
                    <div className="flex items-center space-x-4 text-xs text-zinc-400 font-light uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <Tag className="h-3 w-3" />
                        <span>{item.content_type}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-light text-white group-hover:text-[#ff6b00] transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-zinc-300 font-light leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>
                    
                    {item.author && (
                      <div className="flex items-center space-x-2 text-sm text-zinc-400">
                        <User className="h-4 w-4" />
                        <span>{item.author.full_name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 text-sm text-zinc-400 group-hover:text-[#ff6b00] transition-colors pt-2">
                      <span>Read More</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
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
              className="text-5xl lg:text-6xl font-light mb-8"
            >
              Stay <span className="italic font-extralight text-[#ff6b00]">Inspired</span>
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
                  className="flex-1 bg-transparent border-b border-zinc-600 pb-4 text-lg font-light placeholder-zinc-500 focus:outline-none focus:border-[#ff6b00] transition-colors text-white"
                  required
                />
                <button type="submit" className="ml-4 text-lg font-light uppercase tracking-wider border-b border-[#ff6b00] pb-4 text-[#ff6b00] hover:text-white hover:border-white transition-colors">
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
                <a href="#" className="text-zinc-400 hover:text-[#ff6b00] transition-colors">LinkedIn</a>
                <a href="#" className="text-zinc-400 hover:text-[#ff6b00] transition-colors">Instagram</a>
                <a href="#" className="text-zinc-400 hover:text-[#ff6b00] transition-colors">Twitter</a>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-8 text-center text-zinc-400 text-sm">
            <p>&copy; 2024 Office of Native Architects. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}