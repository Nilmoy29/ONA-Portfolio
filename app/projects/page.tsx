"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, MapPin, Calendar, ArrowRight, Filter, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { ProjectsLoadingScreen } from '@/components/projects-loading-screen'

interface Project {
  id: string
  title: string
  slug: string
  description: string | null
  featured_image_url: string | null
  client_name: string | null
  location: string | null
  project_status: string | null
  created_at: string
  categories?: {
    id: string
    name: string
    color: string | null
  }
}

interface Category {
  id: string
  name: string
  slug: string
  color: string | null
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showLoadingScreen, setShowLoadingScreen] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // Debug logging
  console.log('ProjectsPage render - showLoadingScreen:', showLoadingScreen, 'loading:', loading);

  useEffect(() => {
    fetchProjects()
    fetchCategories()
  }, [searchTerm, selectedCategory, sortBy])

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)
    // Don't show loading screen for subsequent fetches (search/filter changes)
    if (projects.length === 0) {
      setShowLoadingScreen(true)
    }
    try {
      // Try using the API endpoint first for better error handling
      const params = new URLSearchParams()
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      params.append('sort', sortBy)

      const response = await fetch(`/api/public/projects?${params}`)
      
      if (response.ok) {
        const result = await response.json()
        setProjects(result.data || [])
        setLoading(false)
        return
      } else {
        console.warn('API endpoint failed, falling back to direct Supabase call')
      }

      // Fallback to direct Supabase call
      let query = supabase
        .from('projects')
        .select(`
          *,
          categories (
            id,
            name,
            color
          )
        `)
        .eq('is_published', true)

      // Apply search filter
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,client_name.ilike.%${searchTerm}%`)
      }

      // Apply category filter
      if (selectedCategory && selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory)
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false })
          break
        case 'oldest':
          query = query.order('created_at', { ascending: true })
          break
        case 'alphabetical':
          query = query.order('title', { ascending: true })
          break
        case 'custom':
          query = query.order('sort_order', { ascending: true })
          break
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching projects:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        
        // Set user-friendly error message
        if (error.code === 'PGRST301') {
          setError('Projects are temporarily unavailable. Please check back later.')
        } else if (error.message?.includes('JWT')) {
          setError('Authentication issue. Please refresh the page.')
        } else {
          setError('Unable to load projects. Please try again later.')
        }
      } else {
        setProjects(data || [])
      }
    } catch (error: any) {
      console.error('Unexpected error fetching projects:', {
        message: error?.message || 'Unknown error',
        stack: error?.stack,
        error: error
      })
      setError('Unexpected error occurred. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching categories:', error)
      } else {
        setCategories(data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'planning': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatStatus = (status: string | null) => {
    if (!status) return 'Planning'
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <>
      {/* Loading Screen - Rendered at top level to cover entire page */}
      {showLoadingScreen && (
        <ProjectsLoadingScreen 
          onComplete={() => {
            console.log('Loading screen completed');
            setShowLoadingScreen(false);
          }}
          duration={5000}
        />
      )}
      
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="bg-zinc-900 border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Back Button */}
            <div className="mb-8">
              <Button variant="outline" size="sm" asChild className="text-zinc-300 hover:text-white border-zinc-700 hover:border-[#ff6b00] hover:bg-[#ff6b00]/10">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-light text-white mb-6">
                Our <span className="text-[#ff6b00]">Projects</span>
              </h1>
              <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
                Explore our portfolio of architectural projects that blend indigenous wisdom 
                with contemporary design principles.
              </p>
            </div>
          </div>
        </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-zinc-900 border-zinc-700 text-white placeholder-zinc-400 focus:border-[#ff6b00] focus:ring-[#ff6b00]/20"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 bg-zinc-900 border-zinc-700 text-white focus:border-[#ff6b00] focus:ring-[#ff6b00]/20">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                <SelectItem value="all" className="text-white hover:bg-zinc-800">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="text-white hover:bg-zinc-800">
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48 bg-zinc-900 border-zinc-700 text-white focus:border-[#ff6b00] focus:ring-[#ff6b00]/20">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700">
              <SelectItem value="newest" className="text-white hover:bg-zinc-800">Newest First</SelectItem>
              <SelectItem value="oldest" className="text-white hover:bg-zinc-800">Oldest First</SelectItem>
              <SelectItem value="alphabetical" className="text-white hover:bg-zinc-800">Alphabetical</SelectItem>
              <SelectItem value="custom" className="text-white hover:bg-zinc-800">Custom Order</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-zinc-300">
            {loading ? 'Loading...' : `${projects.length} project${projects.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-zinc-800 aspect-[4/3] rounded-lg mb-4"></div>
                <div className="h-4 bg-zinc-800 rounded mb-2"></div>
                <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-zinc-400 text-lg mb-4">{error}</p>
            <div className="space-x-4">
              <Button 
                variant="outline" 
                onClick={() => fetchProjects()}
                className="border-zinc-700 text-zinc-300 hover:border-[#ff6b00] hover:text-[#ff6b00] hover:bg-[#ff6b00]/10"
              >
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setError(null)
                }}
                className="border-zinc-700 text-zinc-300 hover:border-[#ff6b00] hover:text-[#ff6b00] hover:bg-[#ff6b00]/10"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-zinc-400 text-lg">No projects found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4 border-zinc-700 text-zinc-300 hover:border-[#ff6b00] hover:text-[#ff6b00] hover:bg-[#ff6b00]/10"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project.id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden bg-zinc-900 border-zinc-800 hover:border-[#ff6b00]/30">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {project.featured_image_url ? (
                    <Image
                      src={project.featured_image_url}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                      <div className="text-zinc-500 text-center">
                        <div className="w-16 h-16 mx-auto mb-2 bg-zinc-700 rounded"></div>
                        <p className="text-sm">No Image</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    {project.categories && (
                      <Badge 
                        className="bg-black/80 text-white hover:bg-black/90 border border-zinc-600"
                        style={{
                          backgroundColor: project.categories.color ? `${project.categories.color}20` : undefined,
                          borderColor: project.categories.color || undefined
                        }}
                      >
                        {project.categories.name}
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-[#ff6b00]/20 text-[#ff6b00] border border-[#ff6b00]/30">
                      {formatStatus(project.project_status)}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium text-white mb-2 group-hover:text-[#ff6b00] transition-colors">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-zinc-300 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <div className="space-y-2 mb-4">
                    {project.client_name && (
                      <div className="flex items-center text-sm text-zinc-400">
                        <span className="font-medium mr-2 text-zinc-300">Client:</span>
                        <span>{project.client_name}</span>
                      </div>
                    )}
                    {project.location && (
                      <div className="flex items-center text-sm text-zinc-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{project.location}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-zinc-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(project.created_at).getFullYear()}</span>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full group text-zinc-300 hover:text-[#ff6b00] hover:bg-[#ff6b00]/10" asChild>
                    <Link href={`/projects/${project.slug}`}>
                      View Project
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More - Future Enhancement */}
        {projects.length > 0 && projects.length % 9 === 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-[#ff6b00] text-[#ff6b00] hover:bg-[#ff6b00] hover:text-black">
              Load More Projects
            </Button>
          </div>
        )}
      </div>
    </div>
    </>
  )
}