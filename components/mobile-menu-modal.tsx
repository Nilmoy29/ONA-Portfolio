"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight, Search, Mail, Phone, MapPin, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface MobileMenuModalProps {
  isOpen: boolean
  onClose: () => void
}

interface MenuItem {
  label: string
  href: string
  description?: string
  external?: boolean
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

export function MobileMenuModal({ isOpen, onClose }: MobileMenuModalProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      setActiveSection(null)
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const menuSections: MenuSection[] = [
    {
      title: "Our Work",
      items: [
        { label: "Projects", href: "/projects", description: "View our architectural portfolio" },
        { label: "Services", href: "/services", description: "Design and consultation services" },
        { label: "ONA Explore", href: "/explore", description: "Articles, research & insights" }
      ]
    },
    {
      title: "About Us", 
      items: [
        { label: "Our Team", href: "/team", description: "Meet the architects and designers" },
        { label: "About ONA", href: "/about", description: "Our story and philosophy" },
        { label: "Sustainability", href: "/sustainability", description: "Our environmental commitment" }
      ]
    },
    {
      title: "Resources",
      items: [
        { label: "News & Updates", href: "/news", description: "Latest insights and announcements" },
        { label: "Careers", href: "/careers", description: "Join our team" },
        { label: "Contact", href: "/contact", description: "Get in touch with us" }
      ]
    }
  ]

  const contactInfo = {
    email: "info@ona.com",
    phone: "+1 (555) 123-4567",
    address: "123 Architecture Street, Design City, DC 12345"
  }

  const socialLinks = [
    { label: "LinkedIn", href: "https://linkedin.com/company/ona", external: true },
    { label: "Instagram", href: "https://instagram.com/ona_architects", external: true },
    { label: "Twitter", href: "https://twitter.com/ona_architects", external: true }
  ]

  const handleLinkClick = () => {
    onClose()
  }

  const toggleSection = (sectionTitle: string) => {
    setActiveSection(activeSection === sectionTitle ? null : sectionTitle)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <div className="flex items-center space-x-3">
                <Image
                  src="/ona-logo-black.png"
                  alt="ONA Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-lg font-medium text-zinc-900">ONA</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Search Button */}
            <div className="p-6 border-b border-zinc-200">
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => {
                  // This would trigger the search modal
                  onClose()
                }}
              >
                <Search className="h-4 w-4 mr-3" />
                Search projects, team, articles...
              </Button>
            </div>

            {/* Menu Sections */}
            <div className="py-4">
              {menuSections.map((section) => (
                <div key={section.title} className="border-b border-zinc-100 last:border-b-0">
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-zinc-50 transition-colors"
                  >
                    <span className="font-medium text-zinc-900">{section.title}</span>
                    <motion.div
                      animate={{ rotate: activeSection === section.title ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="h-4 w-4 text-zinc-400" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {activeSection === section.title && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-2">
                          {section.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={handleLinkClick}
                              className="block px-6 py-3 pl-12 hover:bg-zinc-50 transition-colors group"
                              {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-zinc-900 group-hover:text-zinc-600 transition-colors">
                                    {item.label}
                                  </div>
                                  {item.description && (
                                    <div className="text-sm text-zinc-500 mt-1">
                                      {item.description}
                                    </div>
                                  )}
                                </div>
                                {item.external && (
                                  <ExternalLink className="h-4 w-4 text-zinc-400" />
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Contact Information */}
            <div className="p-6 bg-zinc-50 border-t border-zinc-200">
              <h3 className="font-medium text-zinc-900 mb-4">Get in Touch</h3>
              
              <div className="space-y-3">
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center space-x-3 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>{contactInfo.email}</span>
                </a>
                
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center space-x-3 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>{contactInfo.phone}</span>
                </a>
                
                <div className="flex items-start space-x-3 text-sm text-zinc-600">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>{contactInfo.address}</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6 pt-4 border-t border-zinc-200">
                <h4 className="font-medium text-zinc-900 mb-3 text-sm">Follow Us</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="p-6 bg-zinc-900 text-white">
              <h3 className="font-medium mb-2">Stay Updated</h3>
              <p className="text-sm text-zinc-300 mb-4">
                Get the latest insights and project updates delivered to your inbox.
              </p>
              <Button
                variant="outline"
                className="w-full bg-transparent border-white text-white hover:bg-white hover:text-zinc-900"
                onClick={() => {
                  // This would trigger the newsletter modal
                  onClose()
                }}
              >
                Subscribe to Newsletter
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 