"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { TeamMemberModal } from "@/components/team-member-modal"

export default function TeamPage() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMemberSlug, setSelectedMemberSlug] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch team members from API
  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        setLoading(true)
        console.log('🔍 Fetching team members...')
        const response = await fetch('/api/public/team')
        const data = await response.json()
        
        console.log('🔍 API response:', { data, hasData: !!data.data, dataLength: data.data?.length })

        if (data.error) {
          console.error('❌ Error fetching team members:', data.error)
          return
        }

        if (data.data && data.data.length > 0) {
          console.log('✅ Successfully fetched', data.data.length, 'team members')
          // Transform API data to match component expectations
          const transformedTeam = data.data.map((member: any) => ({
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
          console.log('⚠️ No team members found or empty data array')
        }
      } catch (error) {
        console.error('💥 Exception in fetchTeamMembers:', error)
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
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 transition-all duration-500 hover:text-transparent hover:[-webkit-text-stroke:1px_white] group">
              <span className="text-white group-hover:text-transparent group-hover:[-webkit-text-stroke:1px_white]">Our</span>{" "}
              <span className="text-zinc-400 group-hover:text-transparent group-hover:[-webkit-text-stroke:1px_white]">Team</span>
            </h1>
            <p className="text-xl text-zinc-300 font-light max-w-3xl mx-auto">
              Meet the talented professionals behind our innovative designs. Our multidisciplinary team brings together
              architects, planners, and cultural consultants who share a commitment to creating meaningful spaces.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid Section */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}

          {!loading && (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {team.map((member: any) => (
                <div
                  key={member.id}
                  className="group cursor-pointer"
                  onMouseEnter={() => setHoveredMember(member.id)}
                  onMouseLeave={() => setHoveredMember(null)}
                  onClick={() => member.slug && handleMemberClick(member.slug)}
                >
                  {/* Transparent Glass Card Container */}
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 hover:border-white/60 transition-all duration-500 overflow-hidden group-hover:-translate-y-2 hover:bg-white/15">
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
                      <div className={`absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-500 border border-white/30 ${
                        hoveredMember === member.id ? "opacity-100 scale-100" : "opacity-0 scale-75"
                      }`}>
                        <ArrowUpRight className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="p-4">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium text-white group-hover:text-zinc-200 transition-colors leading-tight">
                          {member.name}
                        </h3>
                        <p className="text-zinc-400 font-light text-xs uppercase tracking-wider">{member.role}</p>
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
        </div>
      </section>

      {/* Team Member Modal */}
      <TeamMemberModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        slug={selectedMemberSlug}
      />

      {/* Culture Section */}
      <section className="py-32 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 transition-all duration-500 hover:text-transparent hover:[-webkit-text-stroke:1px_white] group">
              <span className="text-white group-hover:text-transparent group-hover:[-webkit-text-stroke:1px_white]">Our</span>{" "}
              <span className="text-zinc-400 group-hover:text-transparent group-hover:[-webkit-text-stroke:1px_white]">Culture</span>
            </h2>
            <p className="text-xl text-zinc-400 font-light max-w-3xl mx-auto">
              We believe in creating an environment where creativity flourishes, 
              diverse perspectives are valued, and everyone can contribute to our shared vision.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Collaborative Spirit",
                description: "We work together across disciplines, sharing knowledge and learning from each other to create extraordinary results."
              },
              {
                title: "Cultural Awareness",
                description: "Our team brings diverse cultural perspectives that enrich our design process and help us create authentic, meaningful spaces."
              },
              {
                title: "Continuous Learning",
                description: "We encourage growth and development, staying current with design trends while honoring traditional architectural wisdom."
              }
            ].map((value, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-light">{index + 1}</span>
                </div>
                <h3 className="text-xl font-light mb-4">{value.title}</h3>
                <p className="text-zinc-400 font-light leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-light mb-4">Office of Native Architects</h4>
              <p className="text-zinc-400 font-light text-sm leading-relaxed">
                Creating architectural narratives that honor indigenous wisdom while embracing contemporary innovation.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-light mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/#projects" className="hover:text-white transition-colors">Projects</a></li>
                <li><a href="/services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="/#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-light mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-zinc-400 hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="text-zinc-400 hover:text-white transition-colors">Instagram</a>
                <a href="#" className="text-zinc-400 hover:text-white transition-colors">Twitter</a>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-700 pt-8 text-center text-zinc-400 text-sm">
            <p>&copy; 2024 Office of Native Architects. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}