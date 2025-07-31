"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Phone, Award, Calendar, ExternalLink, MapPin } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

interface TeamMemberModalProps {
  isOpen: boolean
  onClose: () => void
  slug: string | null
}

interface TeamMember {
  id: string
  name: string
  slug: string
  position: string
  bio: string
  long_bio?: string
  email?: string
  phone?: string
  linkedin_url?: string
  twitter_url?: string
  portfolio_url?: string
  profile_image_url?: string
  gallery_images?: string[]
  specializations?: string[]
  education?: string
  experience_years?: number
  certifications?: string[]
  created_at: string
}

export function TeamMemberModal({ isOpen, onClose, slug }: TeamMemberModalProps) {
  const [member, setMember] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && slug) {
      fetchTeamMember()
    }
  }, [isOpen, slug])

  const fetchTeamMember = async () => {
    if (!slug) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

      if (error) {
        console.error('Error fetching team member:', error)
        return
      }

      setMember(data)
    } catch (error) {
      console.error('Error fetching team member:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
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
            initial={{ y: "100%", opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 200,
              duration: 0.6 
            }}
            className="bg-black/90 backdrop-blur-lg rounded-t-3xl w-full max-w-6xl max-h-[92vh] overflow-hidden shadow-2xl border border-gray-800"
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
            <div className="overflow-y-auto max-h-[calc(92vh-100px)] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {loading ? (
                <div className="p-12 flex items-center justify-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent absolute top-0 left-0"></div>
                  </div>
                </div>
              ) : member ? (
                <div className="p-8 space-y-10">
                  {/* Profile Section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col lg:flex-row gap-10"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-56 h-56 lg:w-64 lg:h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden mx-auto lg:mx-0 shadow-lg">
                        <Image
                          src={member.profile_image_url || "/placeholder.svg"}
                          alt={member.name}
                          width={256}
                          height={256}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-6">
                      <div>
                        <h2 className="text-4xl lg:text-5xl font-extralight mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{member.name}</h2>
                        <p className="text-2xl text-gray-300 font-light mb-6">{member.position}</p>
                      </div>
                      
                      <p className="text-lg text-gray-300 font-light leading-relaxed">
                        {member.long_bio || member.bio}
                      </p>

                      {/* Contact Info */}
                      <div className="flex flex-wrap gap-4 pt-4">
                        {member.email && (
                          <motion.a
                            href={`mailto:${member.email}`}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors text-sm text-gray-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Mail className="h-4 w-4" />
                            <span>Email</span>
                          </motion.a>
                        )}
                        
                        {member.phone && (
                          <motion.a
                            href={`tel:${member.phone}`}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors text-sm text-gray-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Phone className="h-4 w-4" />
                            <span>Call</span>
                          </motion.a>
                        )}
                        
                        {member.linkedin_url && (
                          <motion.a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors text-sm text-gray-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>LinkedIn</span>
                          </motion.a>
                        )}
                        
                        {member.portfolio_url && (
                          <motion.a
                            href={member.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors text-sm text-gray-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>Portfolio</span>
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Specializations */}
                  {member.specializations && member.specializations.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                    >
                      <h3 className="text-xl font-light mb-4 flex items-center text-white">
                        <Award className="h-5 w-5 mr-3 text-gray-400" />
                        Specializations
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {member.specializations.map((spec, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="px-3 py-1 bg-gray-700/50 border border-gray-600 rounded-full text-sm font-light text-gray-300"
                          >
                            {spec}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Experience & Education */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {member.education && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
                      >
                        <h4 className="font-light mb-3 text-gray-300">Education</h4>
                        <p className="text-sm text-gray-400">{member.education}</p>
                      </motion.div>
                    )}
                    
                    {member.experience_years && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
                      >
                        <h4 className="font-light mb-3 text-gray-300">Experience</h4>
                        <p className="text-sm text-gray-400">{member.experience_years}+ years</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Certifications */}
                  {member.certifications && member.certifications.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                    >
                      <h3 className="text-xl font-light mb-4 text-white">Certifications</h3>
                      <div className="space-y-2">
                        {member.certifications.map((cert, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            className="flex items-center space-x-3"
                          >
                            <Award className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-300">{cert}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Gallery */}
                  {member.gallery_images && member.gallery_images.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-light text-white">Gallery</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {member.gallery_images.map((image, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            className="aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
                          >
                            <Image
                              src={image}
                              alt={`${member.name} gallery ${index + 1}`}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Member Since */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center pt-8 border-t border-gray-800"
                  >
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Team member since {formatDate(member.created_at)}</span>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-400">Team member not found</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 