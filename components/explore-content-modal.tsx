"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, User, Tag, ExternalLink, Play, FileText, Eye } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

interface ExploreContentModalProps {
  isOpen: boolean
  onClose: () => void
  slug: string | null
}

interface ExploreContent {
  id: string
  title: string
  slug: string
  subtitle?: string
  description?: string
  content?: string
  featured_image_url?: string
  gallery_images?: string[]
  video_url?: string
  content_type: string
  tags?: string[]
  author?: string
  external_link?: string
  publication_date?: string
  excerpt?: string
  created_at: string
  updated_at: string
}

export function ExploreContentModal({ isOpen, onClose, slug }: ExploreContentModalProps) {
  const [content, setContent] = useState<ExploreContent | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && slug) {
      fetchExploreContent()
    }
  }, [isOpen, slug])

  const fetchExploreContent = async () => {
    if (!slug) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('explore_content')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

      if (error) {
        console.error('Error fetching explore content:', error)
        return
      }

      setContent(data)
    } catch (error) {
      console.error('Error fetching explore content:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getContentTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'article':
        return FileText
      case 'research':
        return FileText
      case 'photography':
        return Eye
      case 'artwork':
        return Tag
      default:
        return FileText
    }
  }

  const formatContent = (contentText: string) => {
    return contentText.split('\n').map((paragraph, index) => (
      <p key={index} className="text-lg text-zinc-600 font-light leading-relaxed mb-4">
        {paragraph}
      </p>
    ))
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.98 }}
            transition={{ 
              type: "spring", 
              damping: 22, 
              stiffness: 250,
              duration: 0.6 
            }}
            className="bg-black/90 backdrop-blur-lg rounded-t-3xl w-full max-w-6xl max-h-[94vh] overflow-hidden shadow-2xl border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-black/95 backdrop-blur-md border-b border-gray-800 p-6 flex items-center justify-between">
              <div className="w-12 h-1.5 bg-gradient-to-r from-white to-gray-400 rounded-full mx-auto" />
              <button
                onClick={onClose}
                className="absolute right-6 top-6 p-2.5 rounded-full hover:bg-gray-800 transition-all duration-200 hover:scale-105 group"
              >
                <X className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(94vh-100px)] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {loading ? (
                <div className="p-12 flex items-center justify-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent absolute top-0 left-0"></div>
                  </div>
                </div>
              ) : content ? (
                <div className="p-8 space-y-10">
                  {/* Header Section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const IconComponent = getContentTypeIcon(content.content_type)
                          return <IconComponent className="h-4 w-4" />
                        })()}
                        <span className="capitalize">{content.content_type}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(content.publication_date || content.created_at)}</span>
                      </div>
                      
                      {content.author && (
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{content.author}</span>
                        </div>
                      )}
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-light text-white">{content.title}</h2>
                    
                    {content.subtitle && (
                      <p className="text-xl text-gray-300 font-light">{content.subtitle}</p>
                    )}

                    {content.excerpt && (
                      <p className="text-lg text-gray-300 font-light leading-relaxed bg-gray-800/30 backdrop-blur-sm p-4 rounded-xl border border-gray-700">
                        {content.excerpt}
                      </p>
                    )}
                  </motion.div>

                  {/* Featured Image */}
                  {content.featured_image_url && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="relative aspect-[16/9] bg-gray-800 rounded-2xl overflow-hidden border border-gray-700"
                    >
                      <Image
                        src={content.featured_image_url}
                        alt={content.title}
                        width={800}
                        height={450}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )}

                  {/* Video */}
                  {content.video_url && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="relative aspect-[16/9] bg-gray-800 rounded-2xl overflow-hidden border border-gray-700"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.button
                          className="bg-black/80 backdrop-blur-sm rounded-full p-4 shadow-lg hover:bg-black/90 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => window.open(content.video_url, '_blank')}
                        >
                          <Play className="h-8 w-8 text-white ml-1" />
                        </motion.button>
                      </div>
                      <Image
                        src={content.featured_image_url || "/placeholder.svg"}
                        alt={content.title}
                        width={800}
                        height={450}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )}

                  {/* Main Content */}
                  {content.content && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="prose prose-lg max-w-none"
                    >
                      <div className="space-y-4">
                        {content.content.split('\n').map((paragraph, index) => (
                          <p key={index} className="text-lg text-gray-300 font-light leading-relaxed mb-4">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Description */}
                  {content.description && content.description !== content.content && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
                    >
                      <h3 className="text-xl font-light mb-4 text-white">Description</h3>
                      <p className="text-gray-300 font-light leading-relaxed">{content.description}</p>
                    </motion.div>
                  )}

                  {/* Tags */}
                  {content.tags && content.tags.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-light flex items-center text-white">
                        <Tag className="h-5 w-5 mr-3 text-gray-400" />
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {content.tags.map((tag, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            className="px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 rounded-full text-sm font-light transition-colors cursor-pointer text-gray-300 border border-gray-600"
                          >
                            #{tag}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Gallery */}
                  {content.gallery_images && content.gallery_images.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-light text-white">Gallery</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {content.gallery_images.map((image, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            className="aspect-[4/3] bg-gray-800 rounded-xl overflow-hidden border border-gray-700"
                          >
                            <Image
                              src={image}
                              alt={`${content.title} gallery ${index + 1}`}
                              width={400}
                              height={300}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* External Link */}
                  {content.external_link && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
                    >
                      <h3 className="text-xl font-light mb-4 text-white">External Resources</h3>
                      <motion.a
                        href={content.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>View External Link</span>
                      </motion.a>
                    </motion.div>
                  )}

                  {/* Metadata Footer */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="text-center pt-8 border-t border-gray-800"
                  >
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Published {formatDate(content.publication_date || content.created_at)}</span>
                      </div>
                      
                      {content.updated_at !== content.created_at && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Updated {formatDate(content.updated_at)}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-400">Content not found</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 