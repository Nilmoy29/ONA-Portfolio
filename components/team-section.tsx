"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { fetchWithRetry } from "@/lib/network-utils"
import { TeamMemberModal } from "./team-member-modal"

// Fallback team data for when Supabase is not available
const fallbackTeam = [
  {
    id: 1,
    name: "Sarah Chen",
    slug: "sarah-chen",
    role: "Principal Architect",
    image: "/placeholder.svg?height=400&width=400",
    bio: "Leading the firm with 15+ years of experience in sustainable architecture",
    education: "M.Arch, Harvard GSD",
    achievements: ["AIA Gold Medal", "Sustainable Design Award 2023"],
  },
  {
    id: 2,
    name: "Marcus Rivera",
    slug: "marcus-rivera",
    role: "Design Director",
    image: "/placeholder.svg?height=400&width=400",
    bio: "Specializing in cultural architecture and community-centered design",
    education: "M.Arch, UC Berkeley",
    achievements: ["Cultural Heritage Award", "Community Impact Recognition"],
  },
  {
    id: 3,
    name: "Aisha Patel",
    slug: "aisha-patel",
    role: "Project Manager",
    image: "/placeholder.svg?height=400&width=400",
    bio: "Ensuring seamless project delivery with focus on sustainability",
    education: "MBA, Stanford | B.Arch, MIT",
    achievements: ["Project Excellence Award", "Green Building Certification"],
  },
  {
    id: 4,
    name: "David Blackhorse",
    slug: "david-blackhorse",
    role: "Cultural Consultant",
    image: "/placeholder.svg?height=400&width=400",
    bio: "Bridging traditional knowledge with contemporary architectural practice",
    education: "PhD Indigenous Studies, University of New Mexico",
    achievements: ["Cultural Preservation Award", "Indigenous Design Recognition"],
  },
  {
    id: 5,
    name: "Elena Rodriguez",
    slug: "elena-rodriguez",
    role: "Sustainability Director",
    image: "/placeholder.svg?height=400&width=400",
    bio: "Leading environmental design and green building initiatives",
    education: "M.S. Environmental Design, Yale",
    achievements: ["LEED Fellow", "Environmental Excellence Award"],
  },
  {
    id: 6,
    name: "James Wilson",
    slug: "james-wilson",
    role: "Senior Architect",
    image: "/placeholder.svg?height=400&width=400",
    bio: "Specializing in heritage restoration and adaptive reuse projects",
    education: "M.Arch, Columbia GSAPP",
    achievements: ["Historic Preservation Award", "Adaptive Reuse Excellence"],
  },
]

export function TeamSection() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)
  const [team, setTeam] = useState(fallbackTeam)
  const [loading, setLoading] = useState(true)
  const [selectedMemberSlug, setSelectedMemberSlug] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch team members via Next.js API
  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        setLoading(true)
        console.log('🔍 Fetching team members via /api/public/team ...')
        const response = await fetchWithRetry('/api/public/team?limit=24', { cache: 'no-store' })
        const json = await response.json()

        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          console.log('✅ Successfully fetched', json.data.length, 'team members')
          // Transform Supabase data to match component expectations
          const transformedTeam = json.data.map((member: any) => ({
            id: member.id,
            name: member.name,
            slug: member.slug,
            role: member.position || "Team Member",
            image: member.profile_image_url || "/placeholder.svg?height=400&width=400",
            bio: member.bio || "",
            education: member.education || "",
            achievements: member.specializations || [],
          }))
          setTeam(transformedTeam)
        } else {
          console.log('⚠️ No team members found or empty data array from API')
        }
      } catch (error) {
        console.error('💥 Exception in fetchTeamMembers:', error)
        console.error('Exception type:', typeof error)
        console.error('Exception stringified:', JSON.stringify(error, null, 2))
        // Keep fallback data on error
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMembers()
  }, [])

  const handleMemberClick = (slug: string) => {
    setSelectedMemberSlug(slug)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMemberSlug(null)
  }

  return (
    <section id="team" className="py-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-5xl lg:text-6xl font-light text-white mb-6">
            Our <span className="text-[#ff6b00]">Team</span>
          </h2>
          <p className="text-xl text-zinc-300 font-light max-w-3xl">
            Meet the talented professionals behind our innovative designs. Our multidisciplinary team brings together
            architects, planners, and cultural consultants who share a commitment to creating meaningful spaces.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {!loading && (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
              onClick={() => member.slug && handleMemberClick(member.slug)}
            >
              {/* Transparent Glass Card Container */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 hover:border-[#ff6b00]/60 transition-all duration-500 overflow-hidden group-hover:-translate-y-2 hover:bg-white/15">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-white/5 to-white/10">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                  </div>
                  
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Floating icon */}
                  <div className={`absolute top-4 right-4 w-10 h-10 bg-[#ff6b00]/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-500 border border-[#ff6b00]/30 ${
                    hoveredMember === member.id ? "opacity-100 scale-100" : "opacity-0 scale-75"
                  }`}>
                    <ArrowUpRight className="h-5 w-5 text-[#ff6b00]" />
                </div>
              </div>

                {/* Content Container */}
                <div className="p-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-white group-hover:text-zinc-200 transition-colors leading-tight">
                  {member.name}
                </h3>
                    <p className="text-[#ff6b00] font-light text-xs uppercase tracking-wider">{member.role}</p>
                  </div>
                  
                  {/* Minimalist action indicator */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="w-6 h-0.5 bg-white/30 group-hover:bg-white/60 transition-colors duration-300"></div>
                    <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors duration-300 uppercase tracking-wider font-light">
                      View
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

      {/* Team Member Modal */}
      <TeamMemberModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        slug={selectedMemberSlug}
      />
      </div>
    </section>
  )
}
