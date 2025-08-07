"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ProjectsLoadingScreen } from '@/components/projects-loading-screen'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar,
  User,
  Users,
  ExternalLink,
  Share2,
  ChevronLeft,
  ChevronRight,
  Building,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  Globe,
  Eye,
  Target,
  Zap,
  Layers,
  Compass,
  Ruler,
  Lightbulb,
  TreePine,
  Heart,
  Star
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ProjectDetail {
  id: string
  title: string
  slug: string
  description: string | null
  content: string | null
  features: string[] | null
  featured_image_url: string | null
  gallery_images: string[] | null
  client_name: string | null
  location: string | null
  project_status: string | null
  created_at: string
  sort_order?: number
  categories?: {
    id: string
    name: string
    color: string | null
  }
  project_team_members?: Array<{
    team_members: {
      id: string
      name: string
      position: string | null
      profile_image_url: string | null
      slug: string
    }
  }>
  project_partners?: Array<{
    partners: {
      id: string
      name: string
      logo_url: string | null
      slug: string
    }
  }>
  team_members?: {
    id: string
    name: string
    position: string | null
    profile_image_url: string | null
    slug: string
  }[]
  partners?: {
    id: string
    name: string
    logo_url: string | null
    slug: string
  }[]
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetchProject(params.slug as string)
    }
  }, [params.slug])

  const fetchProject = async (slug: string) => {
    console.log('🔍 Fetching project with slug:', slug)
    console.log('🔍 Slug type:', typeof slug)
    console.log('🔍 Slug length:', slug.length)
    
    try {
      // First check if any projects exist with this slug
      const { data: projects, error: queryError } = await supabase
        .from('projects')
        .select(`
          *,
          categories (
            id,
            name,
            color
          ),
          project_team_members (
            team_members (
              id,
              name,
              position,
              profile_image_url,
              slug
            )
          ),
          project_partners (
            partners (
              id,
              name,
              logo_url,
              slug
            )
          )
        `)
        .eq('slug', slug)
        .eq('is_published', true)

      console.log('🔍 Query completed. Error:', queryError)
      console.log('🔍 Projects found:', projects?.length || 0)
      
      if (queryError) {
        console.error('Database query error:', queryError)
        setError('Database error occurred')
        return
      }

      if (!projects || projects.length === 0) {
        console.error('No project found with slug:', slug)
        console.log('🔍 Available projects check...')
        
        // Debug: Check what projects exist
        const { data: allProjects } = await supabase
          .from('projects')
          .select('slug, title, is_published')
          .eq('is_published', true)
        
        console.log('🔍 All available published projects:', allProjects?.map(p => p.slug))
        setError('Project not found')
        return
      }

      if (projects.length > 1) {
        console.error('Multiple projects found with slug:', slug, 'Projects:', projects.map(p => p.id))
        setError('Multiple projects found with this identifier')
        return
      }

      // Use the single project found
      const project = projects[0]
      console.log('✅ Project loaded successfully:', project.title)
      
      setProject({
        ...project,
        team_members: project.project_team_members?.map((ptm: any) => ptm.team_members) || [],
        partners: project.project_partners?.map((pp: any) => pp.partners) || []
      })
    } catch (error) {
      console.error('Error fetching project:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'planning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
    }
  }

  const formatStatus = (status: string | null) => {
    if (!status) return 'Planning'
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const allImages = [
    ...(project?.featured_image_url ? [project.featured_image_url] : []),
    ...(project?.gallery_images || [])
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const handleBackNavigation = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back()
    } else {
      // Fallback to projects page if no history
      router.push('/projects')
    }
  }

  const shareProject = async () => {
    if (navigator.share && project) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description || '',
          url: window.location.href,
        })
      } catch (err) {
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <ProjectsLoadingScreen 
        onComplete={() => {
          // This will be called when loading is complete
          // The actual loading state is managed by the component's loading state
        }}
        duration={2000}
        title="Loading Project"
        subtitle="Please wait while we fetch the project details..."
        showText={true}
      />
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          className="text-center max-w-md mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert className="bg-red-950/50 border-red-800/50 text-red-200 mb-6">
            <AlertDescription className="text-lg">{error || 'Project not found'}</AlertDescription>
          </Alert>
          <Button asChild variant="outline" size="lg" className="bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800">
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <motion.div 
        className="relative h-screen overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background Image */}
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {project.featured_image_url ? (
            <Image
              src={project.featured_image_url}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
              <span className="text-zinc-500 text-2xl">No Image Available</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/60"></div>
        </motion.div>

        {/* Navigation */}
        <motion.div 
          className="absolute top-8 left-8 z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackNavigation}
            className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm"
          >
              <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </motion.div>

        {/* Share Button */}
        <motion.div 
          className="absolute top-8 right-8 z-20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            variant="outline" 
            size="sm" 
            onClick={shareProject}
            className="bg-black/50 border-white/20 text-white hover:bg-black/70 backdrop-blur-sm"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </motion.div>

        {/* Project Info Overlay */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-8 z-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto">
            {/* Status and Category Badges */}
            <motion.div 
              className="flex flex-wrap items-center gap-3 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {project.categories && (
                <Badge 
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 backdrop-blur-sm px-3 py-1"
                  style={{
                    backgroundColor: project.categories.color ? `${project.categories.color}30` : undefined,
                    borderColor: project.categories.color ? `${project.categories.color}60` : undefined
                  }}
                >
                  {project.categories.name}
                </Badge>
              )}
              <Badge 
                variant="outline"
                className={`${getStatusColor(project.project_status)} backdrop-blur-sm px-3 py-1`}
              >
                {formatStatus(project.project_status)}
              </Badge>
            </motion.div>

            {/* Project Title */}
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {project.title}
            </motion.h1>

            {/* Project Meta Info */}
            <motion.div 
              className="flex flex-wrap items-center gap-8 text-white/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              {project.client_name && (
                <div className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  <span>{project.client_name}</span>
                </div>
              )}
              {project.location && (
                <div className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" />
                  <span>{project.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                <span>{new Date(project.created_at).getFullYear()}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div 
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="relative bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-16">
              
              {/* Project Description */}
              <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl font-light text-white mb-8">About This Project</h2>
                <div className="prose prose-lg prose-invert max-w-none">
                  {project.content ? (
                    <p className="text-zinc-300 text-xl leading-relaxed whitespace-pre-wrap">
                      {project.content}
                    </p>
                  ) : project.description ? (
                    <p className="text-zinc-300 text-xl leading-relaxed whitespace-pre-wrap">
                      {project.description}
                    </p>
                  ) : (
                    <p className="text-zinc-500 italic text-xl">No description available.</p>
                  )}
                </div>
              </motion.section>

              {/* Project Gallery */}
              {allImages.length > 1 && (
                <motion.section
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h2 className="text-4xl font-light text-white mb-8">Project Gallery</h2>
                  <div className="grid grid-cols-1 gap-6">
                    {allImages.slice(1).map((imageUrl, index) => (
                      <motion.div 
                        key={index}
                        className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => {
                          setCurrentImageIndex(index + 1)
                          setIsGalleryOpen(true)
                        }}
                      >
                        <Image
                          src={imageUrl}
                          alt={`${project.title} - Image ${index + 2}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                          >
                            <ExternalLink className="w-6 h-6 text-white" />
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Project Features */}
              {project.features && project.features.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <h2 className="text-4xl font-light text-white mb-8">Key Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        className="group relative bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 hover:bg-zinc-900/50 transition-all duration-300"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        <div className="flex items-start gap-4">
                          <motion.div
                            className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Sparkles className="w-6 h-6 text-white" />
                          </motion.div>
                          <div>
                            <h3 className="text-lg font-medium text-white mb-2 group-hover:text-zinc-200 transition-colors">{feature}</h3>
                            <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                              Key feature of this architectural project.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Project Leader */}
              {project.team_members && project.team_members.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <h2 className="text-4xl font-light text-white mb-8">Project Leader</h2>
                  <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-8">
                    {(() => {
                      const leader = project.team_members[0]; // First team member as leader
                      return (
                        <div className="flex items-center gap-6">
                          <motion.div 
                            className="relative w-20 h-20 rounded-2xl overflow-hidden bg-zinc-800 flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                          >
                            {leader.profile_image_url ? (
                              <Image
                                src={leader.profile_image_url}
                                alt={leader.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
                                <User className="w-10 h-10 text-zinc-400" />
                              </div>
                            )}
                          </motion.div>
                          <div>
                            <h3 className="text-2xl font-medium text-white mb-2">{leader.name}</h3>
                            <p className="text-zinc-400 text-lg mb-3">
                              {leader.position || 'Project Leader'}
                            </p>
                            <p className="text-zinc-500 text-sm">
                              Leading this project from concept to completion
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </motion.section>
              )}

              {/* Project Team */}
              {project.team_members && project.team_members.length > 1 && (
                <motion.section
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <h2 className="text-4xl font-light text-white mb-8">Project Team</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {project.team_members.slice(1).map((member, index) => (
                      <motion.div
                        key={member.id}
                        className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 hover:bg-zinc-900/50 transition-all duration-300 group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="text-center">
                          <motion.div 
                            className="relative w-16 h-16 mx-auto mb-4 rounded-2xl overflow-hidden bg-zinc-800"
                            whileHover={{ scale: 1.05 }}
                          >
                            {member.profile_image_url ? (
                              <Image
                                src={member.profile_image_url}
                                alt={member.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
                                <User className="w-8 h-8 text-zinc-400" />
                              </div>
                            )}
                          </motion.div>
                          <h4 className="text-white font-medium mb-1 group-hover:text-zinc-300 transition-colors">
                            {member.name}
                          </h4>
                          <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                            {member.position || 'Team Member'}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Project Partners */}
              {project.partners && project.partners.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <h2 className="text-4xl font-light text-white mb-8">Project Partners</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {project.partners.map((partner, index) => (
                      <motion.div
                        key={partner.id}
                        className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 hover:bg-zinc-900/50 transition-all duration-300 group text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        whileHover={{ y: -5 }}
                      >
                        <motion.div 
                          className="relative w-12 h-12 mx-auto mb-3 rounded-lg overflow-hidden bg-zinc-800"
                          whileHover={{ scale: 1.05 }}
                        >
                          {partner.logo_url ? (
                            <Image
                              src={partner.logo_url}
                              alt={partner.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
                              <Building className="w-6 h-6 text-zinc-400" />
                            </div>
                          )}
                        </motion.div>
                        <h4 className="text-white font-medium text-sm group-hover:text-zinc-300 transition-colors">
                          {partner.name}
                        </h4>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              
              {/* Project Details Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-medium text-white mb-8 flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-zinc-400" />
                      Project Details
                    </h3>
                    <div className="space-y-6">
                      {[
                        { label: "Client", value: project.client_name, icon: User },
                        { label: "Location", value: project.location, icon: MapPin },
                        { label: "Status", value: formatStatus(project.project_status), icon: Building, isBadge: true },
                        { label: "Completed", value: new Date(project.created_at).getFullYear(), icon: Calendar },
                        { label: "Category", value: project.categories?.name, icon: Award, isBadge: true }
                      ].filter(item => item.value).map((item, index) => (
                        <motion.div
                          key={index}
                          className="group"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1, duration: 0.4 }}
                        >
                          <label className="text-sm font-medium text-zinc-500 flex items-center gap-2 mb-2">
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </label>
                          {item.isBadge ? (
                            <Badge 
                              variant="outline"
                              className={item.label === "Status" 
                                ? getStatusColor(project.project_status)
                                : "bg-zinc-800/50 text-zinc-300 border-zinc-700"
                              }
                              style={item.label === "Category" && project.categories ? {
                                backgroundColor: project.categories.color ? `${project.categories.color}20` : undefined,
                                borderColor: project.categories.color || undefined,
                                color: project.categories.color || undefined
                              } : undefined}
                            >
                              {item.value}
                            </Badge>
                          ) : (
                            <p className="text-white text-lg group-hover:text-zinc-300 transition-colors">
                              {item.value}
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-medium text-white mb-4">
                      Interested in Similar Work?
                    </h3>
                    <p className="text-zinc-400 mb-8 leading-relaxed">
                      Let's discuss how we can bring your vision to life with sustainable, 
                      culturally responsive design that honors both tradition and innovation.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button asChild size="lg" className="w-full bg-white text-black hover:bg-zinc-200 font-medium">
                        <Link href="/contact">
                          Start Your Project
                          <motion.div
                            className="ml-2"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight className="w-5 h-5" />
                          </motion.div>
                        </Link>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Gallery Lightbox */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsGalleryOpen(false)}
          >
            <motion.div 
              className="relative max-w-6xl max-h-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setIsGalleryOpen(false)}
                className="absolute -top-12 right-0 text-white hover:text-zinc-300 text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                ✕
              </motion.button>
              
              {/* Image Container */}
              <motion.div className="relative rounded-2xl overflow-hidden">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={allImages[currentImageIndex]}
                    alt={`${project.title} - Image ${currentImageIndex + 1}`}
                    width={1200}
                    height={800}
                    className="object-contain max-h-[80vh] rounded-2xl"
                  />
                </motion.div>
                
                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                  <>
                    <motion.button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-zinc-300 bg-black/50 backdrop-blur-sm rounded-full p-3 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </motion.button>
                    <motion.button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-zinc-300 bg-black/50 backdrop-blur-sm rounded-full p-3 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </motion.button>
                  </>
                )}
              </motion.div>
              
              {/* Image Counter */}
              <motion.div 
                className="text-center text-white mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                  <span className="text-sm font-medium">
                    {currentImageIndex + 1} of {allImages.length}
                  </span>
                </div>
              </motion.div>

              {/* Navigation Dots */}
              {allImages.length > 1 && (
                <motion.div 
                  className="flex justify-center mt-4 gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {allImages.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                      }`}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.8 }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}