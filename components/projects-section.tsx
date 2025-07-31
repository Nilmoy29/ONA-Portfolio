"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, MapPin, Square } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { supabaseQueryWithRetry, logNetworkStatus } from "@/lib/network-utils"

// Fallback projects data for when Supabase is not available
const fallbackProjects = [
  {
    id: 1,
    title: "Sacred Waters Cultural Center",
    slug: "sacred-waters-cultural-center",
    category: "Cultural",
    type: "Commercial",
    year: "2024",
    location: "Santa Fe, New Mexico",
    area: "15,000 sq ft",
    client: "Pueblo Cultural Foundation",
    image: "https://selo.global/wp-content/uploads/2018/03/Selo-blog-inset-Disney-Concert-Hall-Los-Angeles.jpg",
    heroImage: "/placeholder.svg?height=1080&width=1920",
    description: "A contemporary interpretation of traditional pueblo architecture that honors cultural heritage while providing modern facilities for education, exhibition, and community gathering.",
    concept: "Drawing inspiration from the natural flow of water and the organic forms of traditional pueblo structures, the design creates a series of interconnected spaces that encourage both contemplation and community interaction.",
    tags: ["Cultural Heritage", "Sustainable Design", "Community Space"],
  },
  {
    id: 2,
    title: "Riverside Community Housing",
    slug: "riverside-housing",
    category: "Housing",
    type: "Residence",
    year: "2023",
    location: "Portland, Oregon",
    area: "45,000 sq ft",
    client: "Portland Housing Authority",
    image: "/placeholder.svg?height=800&width=1200",
    heroImage: "/placeholder.svg?height=1080&width=1920",
    description: "Sustainable housing that connects residents with nature through biophilic design principles and community-centered planning.",
    concept: "Inspired by the natural flow of the nearby river, the housing complex is organized around shared green spaces and community gardens.",
    tags: ["Affordable Housing", "Biophilic Design", "Community"],
  },
  {
    id: 3,
    title: "Indigenous Arts Museum",
    slug: "indigenous-arts-museum",
    category: "Cultural",
    type: "Commercial",
    year: "2023",
    location: "Vancouver, Canada",
    area: "25,000 sq ft",
    client: "First Nations Cultural Society",
    image: "/placeholder.svg?height=800&width=1200",
    heroImage: "/placeholder.svg?height=1080&width=1920",
    description: "Modern gallery spaces celebrating native artistic traditions with flexible exhibition areas and community workshop spaces.",
    concept: "The design reflects traditional indigenous architectural principles while incorporating contemporary museum standards.",
    tags: ["Museum Design", "Cultural Preservation", "Exhibition"],
  },
  {
    id: 4,
    title: "Healing Lodge Retreat",
    slug: "healing-lodge-retreat",
    category: "Wellness",
    type: "Religious",
    year: "2023",
    location: "Sedona, Arizona",
    area: "8,000 sq ft",
    client: "Wellness Foundation",
    image: "/placeholder.svg?height=800&width=1200",
    heroImage: "/placeholder.svg?height=1080&width=1920",
    description: "Spiritual retreat center honoring traditional healing practices with meditation spaces and therapeutic gardens.",
    concept: "Designed to harmonize with the natural landscape while providing spaces for healing and reflection.",
    tags: ["Wellness Architecture", "Spiritual Design", "Natural Integration"],
  },
  {
    id: 5,
    title: "Urban Eco-Campus",
    slug: "urban-eco-campus",
    category: "Education",
    type: "Commercial",
    year: "2022",
    location: "Seattle, Washington",
    area: "60,000 sq ft",
    client: "Green Education Initiative",
    image: "/placeholder.svg?height=800&width=1200",
    heroImage: "/placeholder.svg?height=1080&width=1920",
    description: "Biophilic design principles in educational architecture creating inspiring learning environments.",
    concept: "The campus integrates natural elements throughout to enhance learning and well-being.",
    tags: ["Educational Design", "Sustainability", "Innovation"],
  },
]



export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("All projects")
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const [projects, setProjects] = useState(fallbackProjects)
  const [categories, setCategories] = useState(["All projects", "Residence", "Commercial", "Religious", "Proposed", "Interior"])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch projects and categories from Supabase with automatic retry
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Log network status for debugging
        logNetworkStatus()
        
        // Fetch categories first with retry
        const categoriesResult = await supabaseQueryWithRetry(async () =>
          await supabase
            .from('categories')
            .select('id, name, slug, sort_order')
            .order('sort_order', { ascending: true })
        )

        if (categoriesResult.error) {
          console.error('❌ Error fetching categories:', categoriesResult.error)
        } else if (categoriesResult.data && Array.isArray(categoriesResult.data) && categoriesResult.data.length > 0) {
          const categoryNames = ["All projects", ...categoriesResult.data.map((cat: any) => cat.name)]
          setCategories(categoryNames)
          console.log('✅ Successfully loaded', categoriesResult.data.length, 'categories')
        }

        // Fetch projects with retry
        const projectsResult = await supabaseQueryWithRetry(async () =>
          await supabase
            .from('projects')
            .select(`
              id, title, slug, description, featured_image_url, location, client_name, 
              project_status, project_type, created_at, sort_order, is_published,
              categories (
                id, name, slug, color
              )
            `)
            .eq('is_published', true)
            .order('sort_order', { ascending: true })
        )

        if (projectsResult.error) {
          console.error('❌ Error fetching projects:', projectsResult.error)
          console.log('🔄 Using fallback projects due to database error')
          return
        }

        if (projectsResult.data && Array.isArray(projectsResult.data) && projectsResult.data.length > 0) {
          const transformedProjects = projectsResult.data.map((project: any) => ({
            id: project.id,
            title: project.title,
            slug: project.slug,
            category: project.categories?.name || "General",
            categorySlug: project.categories?.slug || "general",
            type: project.project_type || project.project_status || "Commercial",
            year: project.created_at ? new Date(project.created_at).getFullYear().toString() : "2024",
            location: project.location || "",
            area: "N/A",
            client: project.client_name || "",
            image: project.featured_image_url || "/placeholder.svg?height=800&width=1200",
            heroImage: project.featured_image_url || "/placeholder.svg?height=1080&width=1920",
            description: project.description || "",
            concept: project.description || "",
            tags: [],
            categoryColor: project.categories?.color || null,
          }))
          setProjects(transformedProjects)
          console.log('✅ Successfully loaded', transformedProjects.length, 'projects from Supabase')
        } else {
          console.log('⚠️ No projects found in database, using fallback data')
        }
      } catch (error: any) {
        console.error('❌ Final error after retries:', error.message || error)
        console.log('🔄 Using fallback projects due to persistent errors')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter projects based on activeFilter and limit to 3 projects
  const filteredProjects = activeFilter === "All projects" 
    ? projects.slice(0, 3)
    : projects.filter((project: any) => 
        project.category.toLowerCase() === activeFilter.toLowerCase() ||
        project.type.toLowerCase() === activeFilter.toLowerCase()
      ).slice(0, 3);

  return (
    <section id="projects" className="py-16 bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
        
        {!loading && (
          <>
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl lg:text-6xl font-light mb-6">Project Showcase</h2>
              <p className="text-xl text-zinc-300 font-light max-w-2xl mb-12">
                Each project represents our commitment to creating spaces that honor cultural heritage while addressing
                contemporary needs.
              </p>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`px-6 py-3 text-sm font-light tracking-wider uppercase transition-all duration-300 border relative group ${
                      activeFilter === category
                        ? "border-[#ff6b00] text-[#ff6b00] bg-[#ff6b00]/10"
                        : "border-zinc-700 text-zinc-400 hover:border-[#ff6b00] hover:text-[#ff6b00]"
                    }`}
                  >
                    {category}
                    {activeFilter === category && (
                      <span className="absolute inset-0 bg-[#ff6b00]/5 -z-10"></span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Vertical Project List - Limited to 3 projects */}
            <div className="grid grid-cols-1 gap-10">
              {filteredProjects.map((project: any, index: number) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group cursor-pointer block"
                    onMouseEnter={() => setHoveredProject(project.id)}
                    onMouseLeave={() => setHoveredProject(null)}
                  >
                    <div className="relative overflow-hidden mb-6">
                      <motion.div
                        className="relative h-[60vh] lg:h-[70vh] bg-zinc-900"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          className="object-cover transition-all duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500" />

                        {/* Project Info Overlay */}
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 bg-gradient-to-t from-black/80 to-transparent"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{
                            opacity: hoveredProject === project.id ? 1 : 0,
                            y: hoveredProject === project.id ? 0 : 20,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 text-sm text-zinc-300">
                            <span className="flex items-center gap-2 uppercase tracking-wider">
                              <MapPin className="w-4 h-4" />
                              {project.location}
                            </span>
                            <span className="flex items-center gap-2 uppercase tracking-wider">
                              <Calendar className="w-4 h-4" />
                              {project.year}
                            </span>
                            <span className="flex items-center gap-2 uppercase tracking-wider">
                              <Square className="w-4 h-4" />
                              {project.area}
                            </span>
                          </div>
                          <h3 className="text-4xl lg:text-5xl font-light leading-tight mb-2">{project.title}</h3>
                          <p className="text-lg text-zinc-300 font-light">{project.description}</p>
                        </motion.div>

                        {/* Arrow Indicator */}
                        <motion.div
                          className="absolute top-6 right-6"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: hoveredProject === project.id ? 1 : 0,
                            scale: hoveredProject === project.id ? 1 : 0.8,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="w-12 h-12 bg-[#ff6b00]/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-[#ff6b00]/30">
                            <ArrowRight className="w-6 h-6 text-[#ff6b00]" />
                          </div>
                        </motion.div>
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* View All Projects Button */}
            {filteredProjects.length === 3 && (
              <motion.div
                className="flex justify-center mt-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Link
                  href="/projects"
                  className="group relative inline-flex items-center gap-4 px-8 py-4 text-lg font-light tracking-wider uppercase border border-[#ff6b00] text-[#ff6b00] transition-all duration-300 hover:bg-[#ff6b00] hover:text-black"
                >
                  View All Projects
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            )}

            {filteredProjects.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-zinc-500 font-light">No projects found for the selected category.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}