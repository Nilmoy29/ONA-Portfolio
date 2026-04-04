"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

const projects = [
  {
    id: 1,
    title: "Cultural Heritage Center",
    slug: "sacred-waters-cultural-center",
    location: "Santa Fe, New Mexico",
    year: "2024",
    category: "Cultural",
    image: "/placeholder.svg?height=600&width=800",
    description: "A contemporary interpretation of traditional pueblo architecture",
  },
  {
    id: 2,
    title: "Riverside Community Housing",
    slug: "riverside-housing",
    location: "Portland, Oregon",
    year: "2023",
    category: "Residential",
    image: "/placeholder.svg?height=600&width=800",
    description: "Sustainable housing that connects residents with nature",
  },
  {
    id: 3,
    title: "Indigenous Arts Museum",
    slug: "indigenous-arts-museum",
    location: "Vancouver, Canada",
    year: "2023",
    category: "Cultural",
    image: "/placeholder.svg?height=600&width=800",
    description: "Modern gallery spaces celebrating native artistic traditions",
  },
  {
    id: 4,
    title: "Eco-Corporate Campus",
    slug: "eco-corporate-campus",
    location: "Seattle, Washington",
    year: "2022",
    category: "Commercial",
    image: "/placeholder.svg?height=600&width=800",
    description: "Biophilic design principles in corporate architecture",
  },
]

export function ProjectsGrid() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-20">
          <h2 className="text-5xl lg:text-6xl font-light text-zinc-900 mb-6">Selected Works</h2>
          <p className="text-xl text-zinc-600 font-light max-w-2xl">
            Each project represents our commitment to creating spaces that honor cultural heritage while addressing
            contemporary needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group cursor-pointer block"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="relative overflow-hidden mb-6">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={800}
                  height={600}
                  className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className={`absolute inset-0 bg-black transition-opacity duration-500 ${
                    hoveredProject === project.id ? "opacity-30" : "opacity-0"
                  }`}
                />
                <div
                  className={`absolute top-6 right-6 transition-all duration-500 ${
                    hoveredProject === project.id ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  }`}
                >
                  <ArrowUpRight className="h-8 w-8 text-white" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-light text-zinc-900 group-hover:text-zinc-600 transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-sm text-zinc-500 font-light">{project.year}</span>
                </div>
                <p className="text-zinc-600 font-light">{project.location}</p>
                <p className="text-zinc-500 text-sm font-light leading-relaxed">{project.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
