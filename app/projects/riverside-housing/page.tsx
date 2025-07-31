"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Square } from "lucide-react"

// Mock project data for the next project
const projectData = {
  title: "Riverside Community Housing",
  subtitle: "Sustainable Housing That Connects Residents with Nature",
  location: "Portland, Oregon",
  year: "2023",
  client: "Portland Housing Authority",
  area: "45,000 sq ft",
  status: "Completed",
  category: "Residential",
  heroImage: "/placeholder.svg?height=1080&width=1920",
  description:
    "The Riverside Community Housing project creates affordable housing that prioritizes environmental sustainability and community connection. The design integrates natural elements and traditional building principles to create a harmonious living environment.",
  concept:
    "Inspired by the natural flow of the nearby river, the housing complex is organized around shared green spaces and community gardens, fostering both environmental stewardship and social interaction among residents.",
  images: [
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
    "/placeholder.svg?height=800&width=1200",
  ],
  process: [
    {
      phase: "Community Needs Assessment",
      description:
        "Comprehensive study of housing needs and environmental conditions to inform sustainable design strategies.",
      image: "/placeholder.svg?height=600&width=800",
    },
    {
      phase: "Sustainable Design Integration",
      description: "Development of passive solar design, rainwater harvesting, and native landscaping systems.",
      image: "/placeholder.svg?height=600&width=800",
    },
    {
      phase: "Community-Centered Construction",
      description: "Construction process that involved local workforce training and sustainable building practices.",
      image: "/placeholder.svg?height=600&width=800",
    },
  ],
}

export default function RiversideHousingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -200])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3])

  return (
    <div ref={containerRef} className="bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3 text-white hover:text-zinc-300 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-light">Back to Projects</span>
            </Link>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image src="/ona-logo-white.png" alt="ONA" width={200} height={70} className="h-14 w-auto" />
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            y: heroY,
            scale: heroScale,
          }}
        >
          <Image
            src={projectData.heroImage || "/placeholder.svg"}
            alt={projectData.title}
            fill
            className="object-cover"
            priority
          />
          <motion.div className="absolute inset-0 bg-black/40" style={{ opacity: heroOpacity }} />
        </motion.div>

        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20 w-full">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="max-w-4xl"
            >
              <h1 className="text-6xl lg:text-8xl font-light leading-none mb-6">{projectData.title}</h1>
              <p className="text-2xl lg:text-3xl font-light text-zinc-300 mb-8">{projectData.subtitle}</p>
              <div className="flex flex-wrap gap-8 text-lg font-light">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-zinc-400" />
                  <span>{projectData.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-zinc-400" />
                  <span>{projectData.year}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Square className="h-5 w-5 text-zinc-400" />
                  <span>{projectData.area}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rest of the content would be similar to the first project page */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-light mb-8">Coming Soon</h2>
              <p className="text-xl font-light text-zinc-300">
                Full project details and immersive experience will be available soon.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
