"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, Building, Users, Briefcase, FileText, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface SearchResult {
  id: string
  title: string
  slug: string
  type: 'project' | 'team' | 'service' | 'explore'
  description?: string
  excerpt?: string
  image?: string
  category?: string
  author?: string
  date?: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setQuery('')
      setResults([])
      setSelectedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (results[selectedIndex]) {
            handleResultClick(results[selectedIndex])
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex])

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.trim().length > 2) {
        performSearch(query.trim())
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setLoading(true)
    try {
      const [projectsRes, teamRes, servicesRes, exploreRes] = await Promise.all([
        fetch(`/api/public/projects?search=${encodeURIComponent(searchQuery)}&limit=5`),
        fetch(`/api/public/team?search=${encodeURIComponent(searchQuery)}&limit=5`),
        fetch(`/api/public/services?search=${encodeURIComponent(searchQuery)}&limit=5`),
        fetch(`/api/public/explore?search=${encodeURIComponent(searchQuery)}&limit=5`)
      ])

      const [projects, team, services, explore] = await Promise.all([
        projectsRes.json(),
        teamRes.json(),
        servicesRes.json(),
        exploreRes.json()
      ])

      const searchResults: SearchResult[] = [
        ...(projects.data || []).map((item: any) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          type: 'project' as const,
          description: item.description,
          image: item.featured_image_url,
          category: item.category?.name,
          date: item.created_at
        })),
        ...(team.data || []).map((item: any) => ({
          id: item.id,
          title: item.name,
          slug: item.slug,
          type: 'team' as const,
          description: item.position,
          image: item.profile_image_url,
          excerpt: item.bio
        })),
        ...(services.data || []).map((item: any) => ({
          id: item.id,
          title: item.name,
          slug: item.slug,
          type: 'service' as const,
          description: item.description,
          image: item.featured_image_url,
          category: item.service_type
        })),
        ...(explore.data || []).map((item: any) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          type: 'explore' as const,
          excerpt: item.excerpt,
          image: item.featured_image_url,
          author: item.author?.name,
          date: item.created_at
        }))
      ]

      setResults(searchResults)
      setSelectedIndex(0)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    onClose()
    // The Link component will handle navigation
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'project': return Building
      case 'team': return Users
      case 'service': return Briefcase
      case 'explore': return FileText
      default: return Search
    }
  }

  const getResultPath = (result: SearchResult) => {
    switch (result.type) {
      case 'project': return `/projects/${result.slug}`
      case 'team': return `/team/${result.slug}`
      case 'service': return `/services/${result.slug}`
      case 'explore': return `/explore/${result.slug}`
      default: return '/'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'project': return 'Project'
      case 'team': return 'Team Member'
      case 'service': return 'Service'
      case 'explore': return 'Article'
      default: return ''
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-blue-100 text-blue-800'
      case 'team': return 'bg-green-100 text-green-800'
      case 'service': return 'bg-purple-100 text-purple-800'
      case 'explore': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-6 border-b border-zinc-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Search projects, team members, services, and articles..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-12 pr-12 h-12 text-lg border-0 focus:ring-0 bg-zinc-50"
                />
                <button
                  onClick={onClose}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {loading && (
                <div className="p-6 text-center">
                  <div className="inline-flex items-center space-x-2 text-zinc-500">
                    <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
                    <span>Searching...</span>
                  </div>
                </div>
              )}

              {!loading && query.trim().length > 2 && results.length === 0 && (
                <div className="p-6 text-center text-zinc-500">
                  <Search className="h-12 w-12 mx-auto mb-4 text-zinc-300" />
                  <p>No results found for "{query}"</p>
                  <p className="text-sm mt-1">Try different keywords or check spelling</p>
                </div>
              )}

              {!loading && query.trim().length <= 2 && (
                <div className="p-6 text-center text-zinc-500">
                  <Search className="h-12 w-12 mx-auto mb-4 text-zinc-300" />
                  <p>Type at least 3 characters to search</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <Badge variant="outline">Projects</Badge>
                    <Badge variant="outline">Team Members</Badge>
                    <Badge variant="outline">Services</Badge>
                    <Badge variant="outline">Articles</Badge>
                  </div>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="py-2">
                  {results.map((result, index) => {
                    const Icon = getResultIcon(result.type)
                    const isSelected = index === selectedIndex
                    
                    return (
                      <Link
                        key={result.id}
                        href={getResultPath(result)}
                        onClick={() => handleResultClick(result)}
                        className={`block px-6 py-4 border-l-4 transition-all ${
                          isSelected 
                            ? 'bg-zinc-50 border-zinc-900' 
                            : 'border-transparent hover:bg-zinc-50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {result.image ? (
                            <Image
                              src={result.image}
                              alt={result.title}
                              width={48}
                              height={48}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center">
                              <Icon className="h-6 w-6 text-zinc-400" />
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge className={getTypeColor(result.type)} variant="secondary">
                                {getTypeLabel(result.type)}
                              </Badge>
                              {result.category && (
                                <span className="text-xs text-zinc-500">{result.category}</span>
                              )}
                            </div>
                            
                            <h3 className="font-medium text-zinc-900 mb-1 truncate">
                              {result.title}
                            </h3>
                            
                            <p className="text-sm text-zinc-600 line-clamp-2">
                              {result.description || result.excerpt}
                            </p>
                            
                            {(result.author || result.date) && (
                              <div className="flex items-center space-x-3 mt-2 text-xs text-zinc-500">
                                {result.author && (
                                  <span>By {result.author}</span>
                                )}
                                {result.date && (
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatDate(result.date)}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <ArrowRight className={`h-5 w-5 transition-all ${
                            isSelected ? 'text-zinc-600 translate-x-1' : 'text-zinc-300'
                          }`} />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-200">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <div className="flex items-center space-x-4">
                  <span>↑↓ Navigate</span>
                  <span>↵ Select</span>
                  <span>Esc Close</span>
                </div>
                {results.length > 0 && (
                  <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 