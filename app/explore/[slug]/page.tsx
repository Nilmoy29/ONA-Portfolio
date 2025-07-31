"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { ArrowRight, ArrowLeft, Calendar, User, Tag, Share2, Bookmark } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function ExploreDetailPage() {
  const params = useParams()
  const [content, setContent] = useState<any>(null)
  const [relatedContent, setRelatedContent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.slug) {
      fetchContent()
      fetchRelatedContent()
    }
  }, [params.slug])

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/public/explore/${params.slug}`)
      const data = await response.json()
      setContent(data.data)
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedContent = async () => {
    try {
      const response = await fetch('/api/public/explore?limit=3')
      const data = await response.json()
      setRelatedContent(data.data || [])
    } catch (error) {
      console.error('Error fetching related content:', error)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="text-lg text-zinc-600 font-light leading-relaxed mb-6">
        {paragraph}
      </p>
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 pb-20 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-16 bg-zinc-200 rounded mb-6"></div>
              <div className="h-8 bg-zinc-200 rounded mb-4"></div>
              <div className="h-64 bg-zinc-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 pb-20 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-light mb-4">Content Not Found</h1>
            <p className="text-zinc-600 mb-8">The content you're looking for doesn't exist.</p>
            <Link href="/explore">
              <button className="flex items-center space-x-2 text-lg font-light uppercase tracking-wider border-b border-black pb-2 hover:text-zinc-600 hover:border-zinc-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Explore</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Back Button */}
      <div className="pt-32 pb-8 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/explore">
            <motion.button
              className="flex items-center space-x-2 text-lg font-light uppercase tracking-wider text-zinc-600 hover:text-black transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Explore</span>
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Hero Section with Modern Card Layout */}
      <section className="pb-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Main Content Card */}
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-2"
            >
              {/* Featured Image Card */}
              {content.featured_image_url && (
                <motion.div
                  className="bg-white rounded-2xl shadow-xl overflow-hidden border border-zinc-100 mb-8"
                  whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-zinc-50 to-zinc-100 overflow-hidden">
                    <Image
                      src={content.featured_image_url}
                      alt={content.title}
                      width={1200}
                      height={675}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              )}

              {/* Content Card */}
              <motion.article
                className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 border border-zinc-100"
                whileHover={{ y: -3, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-4xl lg:text-5xl font-light mb-6">{content.title}</h1>
                
                {content.excerpt && (
                  <p className="text-xl text-zinc-600 font-light leading-relaxed mb-8 pb-8 border-b border-zinc-100">
                    {content.excerpt}
                  </p>
                )}

                <div className="prose prose-lg max-w-none">
                  {content.content && formatContent(content.content)}
                </div>
              </motion.article>
            </motion.div>

            {/* Sidebar Cards */}
            <motion.div 
              variants={itemVariants}
              className="space-y-6"
            >
              {/* Meta Info Card */}
              <motion.div
                className="bg-white rounded-xl shadow-md p-6 border border-zinc-100"
                whileHover={{ y: -3, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-light mb-4">Article Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Tag className="h-4 w-4 text-zinc-400" />
                    <div>
                      <p className="text-sm text-zinc-500">Type</p>
                      <p className="font-light capitalize">{content.content_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-zinc-400" />
                    <div>
                      <p className="text-sm text-zinc-500">Published</p>
                      <p className="font-light">{formatDate(content.created_at)}</p>
                    </div>
                  </div>
                  {content.author && (
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-zinc-400" />
                      <div>
                        <p className="text-sm text-zinc-500">Author</p>
                        <p className="font-light">{content.author.full_name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Actions Card */}
              <motion.div
                className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-xl shadow-lg p-6"
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-light mb-4">Actions</h3>
                <div className="space-y-3">
                  <motion.button
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-zinc-700/50 backdrop-blur-sm border border-zinc-600 rounded-lg hover:bg-zinc-600/50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="font-light">Share Article</span>
                  </motion.button>
                  
                  <motion.button
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-zinc-700/50 backdrop-blur-sm border border-zinc-600 rounded-lg hover:bg-zinc-600/50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Bookmark className="h-4 w-4" />
                    <span className="font-light">Save for Later</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Newsletter Card */}
              <motion.div
                className="bg-white rounded-xl shadow-md p-6 border border-zinc-100"
                whileHover={{ y: -3, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-light mb-3">Stay Updated</h3>
                <p className="text-sm text-zinc-600 mb-4">Get the latest insights delivered to your inbox.</p>
                <motion.button
                  className="w-full px-4 py-2 bg-black text-white rounded-lg font-light hover:bg-zinc-800 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Author Section */}
      {content.author && (
        <section className="py-20 bg-zinc-50">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
              className="flex items-center space-x-6"
            >
              <motion.div 
                variants={itemVariants}
                className="w-20 h-20 bg-zinc-200 rounded-full overflow-hidden flex-shrink-0"
              >
                <Image
                  src={content.author.avatar_url || "/api/placeholder/80/80"}
                  alt={content.author.full_name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-light mb-2">{content.author.full_name}</h3>
                <p className="text-zinc-600 font-light leading-relaxed">
                  {content.author.full_name} is a key contributor to our architectural insights and cultural perspectives. 
                  Their work focuses on bridging traditional design principles with contemporary innovation.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Related Content */}
      {relatedContent.length > 0 && (
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-20">
                <h2 className="text-5xl lg:text-6xl font-light mb-6">
                  Related <span className="italic font-extralight">Content</span>
                </h2>
                <p className="text-xl text-zinc-600 font-light max-w-3xl mx-auto">
                  Continue exploring our insights and discoveries.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {relatedContent.filter((item: any) => item.slug !== content.slug).slice(0, 3).map((item: any) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="group cursor-pointer"
                  >
                    <Link href={`/explore/${item.slug}`}>
                      <div className="aspect-[4/3] bg-zinc-100 rounded-lg overflow-hidden mb-6">
                        <Image
                          src={item.featured_image_url || "/api/placeholder/400/300"}
                          alt={item.title}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      <div className="space-y-3">
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
                        
                        <h3 className="text-xl font-light group-hover:text-zinc-600 transition-colors">
                          {item.title}
                        </h3>
                        
                        <p className="text-zinc-600 font-light leading-relaxed line-clamp-3">
                          {item.excerpt}
                        </p>
                        
                        <div className="flex items-center space-x-2 text-sm text-zinc-400 group-hover:text-zinc-600 transition-colors">
                          <span>Read More</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-32 bg-zinc-900 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="text-center"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl lg:text-5xl font-light mb-6"
            >
              Stay <span className="italic font-extralight">Updated</span>
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto mb-8"
            >
              Get the latest insights, projects, and architectural discoveries delivered to your inbox.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="max-w-md mx-auto"
            >
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 bg-transparent border-b border-zinc-700 pb-4 text-lg font-light placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                />
                <button className="ml-4 text-lg font-light uppercase tracking-wider border-b border-white pb-4 hover:text-zinc-300 hover:border-zinc-300 transition-colors">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
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
          <div className="border-t border-zinc-700 pt-8 text-center text-zinc-400 text-sm">
            <p>&copy; 2024 Office of Native Architects. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}