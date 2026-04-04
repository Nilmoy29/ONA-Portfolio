"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { ArrowRight, ArrowLeft, MapPin, Mail, ExternalLink, Award, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function TeamMemberDetailPage() {
  const params = useParams()
  const [teamMember, setTeamMember] = useState<any>(null)
  const [otherMembers, setOtherMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.slug) {
      fetchTeamMember()
      fetchOtherMembers()
    }
  }, [params.slug])

  const fetchTeamMember = async () => {
    try {
      const response = await fetch(`/api/public/team/${params.slug}`)
      const data = await response.json()
      setTeamMember(data.data)
    } catch (error) {
      console.error('Error fetching team member:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOtherMembers = async () => {
    try {
      const response = await fetch('/api/public/team?limit=3')
      const data = await response.json()
      setOtherMembers(data.data || [])
    } catch (error) {
      console.error('Error fetching other members:', error)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 pb-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-16 bg-zinc-200 rounded mb-6"></div>
              <div className="h-8 bg-zinc-200 rounded mb-4"></div>
              <div className="h-64 bg-zinc-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!teamMember) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 pb-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-light mb-4">Team Member Not Found</h1>
            <p className="text-zinc-600 mb-8">The team member you're looking for doesn't exist.</p>
            <Link href="/team">
              <button className="flex items-center space-x-2 text-lg font-light uppercase tracking-wider border-b border-black pb-2 hover:text-zinc-600 hover:border-zinc-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Team</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Back Button */}
      <div className="pt-32 pb-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/team">
            <motion.button
              className="flex items-center space-x-2 text-lg font-light uppercase tracking-wider text-zinc-600 hover:text-black transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Team</span>
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Hero Section with Modern Cards */}
      <section className="pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid lg:grid-cols-5 gap-8"
          >
            {/* Profile Card */}
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-2"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-zinc-100">
                <div className="aspect-[3/4] bg-gradient-to-br from-zinc-50 to-zinc-100 overflow-hidden">
                  <Image
                    src={teamMember.profile_image_url || "/api/placeholder/600/800"}
                    alt={teamMember.name}
                    width={600}
                    height={800}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8">
                  <h1 className="text-3xl font-light mb-2">{teamMember.name}</h1>
                  <p className="text-lg text-zinc-600 font-light mb-6">{teamMember.position}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <motion.div
                      className="flex items-center space-x-2 px-3 py-1 bg-zinc-900 text-white rounded-full text-xs"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Mail className="h-3 w-3" />
                      <span>Connect</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Info Cards */}
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-3 space-y-6"
            >
              {/* Main Info Card */}
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-8 border border-zinc-100"
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-4xl lg:text-5xl font-light mb-6">
                  Meet <span className="italic font-extralight">{teamMember.name.split(' ')[0]}</span>
                </h2>
                
                {teamMember.bio && (
                  <p className="text-lg text-zinc-600 font-light leading-relaxed mb-8">
                    {teamMember.bio}
                  </p>
                )}

                <motion.button
                  className="flex items-center space-x-3 text-lg font-light uppercase tracking-wider border-b border-black pb-2 hover:text-zinc-600 hover:border-zinc-600 transition-colors group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>View Portfolio</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>

              {/* Specializations Card */}
              {teamMember.specializations && (
                <motion.div
                  className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-2xl shadow-lg p-8"
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-light mb-6 flex items-center">
                    <Award className="h-6 w-6 mr-3 text-zinc-400" />
                    Expertise
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {(typeof teamMember.specializations === 'string' 
                      ? teamMember.specializations.split(',') 
                      : teamMember.specializations
                    ).map((spec: string, index: number) => (
                      <motion.span 
                        key={index}
                        className="px-4 py-2 bg-zinc-700/50 backdrop-blur-sm border border-zinc-600 text-zinc-200 font-light text-sm rounded-xl flex items-center justify-center"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(63, 63, 70, 0.7)" }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {spec.trim()}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  className="bg-white rounded-xl shadow-md p-6 border border-zinc-100"
                  whileHover={{ y: -3, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <Calendar className="h-5 w-5 text-zinc-400" />
                    <h4 className="font-light text-zinc-600">Experience</h4>
                  </div>
                  <p className="text-2xl font-light">{new Date().getFullYear() - 2010}+ years</p>
                </motion.div>

                <motion.div
                  className="bg-white rounded-xl shadow-md p-6 border border-zinc-100"
                  whileHover={{ y: -3, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <Award className="h-5 w-5 text-zinc-400" />
                    <h4 className="font-light text-zinc-600">Projects</h4>
                  </div>
                  <p className="text-2xl font-light">{teamMember.projects?.length || 0}</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      {teamMember.projects && teamMember.projects.length > 0 && (
        <section className="py-32 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-20">
                <h2 className="text-5xl lg:text-6xl font-light mb-6">
                  Featured <span className="italic font-extralight">Projects</span>
                </h2>
                <p className="text-xl text-zinc-600 font-light max-w-3xl mx-auto">
                  Explore some of the notable projects {teamMember.name} has contributed to.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMember.projects.filter((p: any) => p.project.is_published).map((projectItem: any, index: number) => (
                  <motion.div
                    key={projectItem.project.id}
                    variants={itemVariants}
                    className="group cursor-pointer"
                  >
                    <Link href={`/projects/${projectItem.project.slug}`}>
                      <motion.div
                        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-zinc-100"
                        whileHover={{ 
                          y: -10, 
                          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                          scale: 1.02 
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <div className="aspect-[4/3] bg-gradient-to-br from-zinc-50 to-zinc-100 overflow-hidden">
                          <Image
                            src={projectItem.project.featured_image_url || "/api/placeholder/400/300"}
                            alt={projectItem.project.title}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        
                        <div className="p-6">
                          <h3 className="text-xl font-light mb-3 group-hover:text-zinc-600 transition-colors">
                            {projectItem.project.title}
                          </h3>
                          
                          <div className="flex items-center space-x-2 text-sm text-zinc-400 group-hover:text-zinc-600 transition-colors">
                            <span>Explore Project</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Philosophy Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-5xl lg:text-6xl font-light mb-8">
                Design <span className="italic font-extralight">Philosophy</span>
              </h2>
              
              <div className="space-y-6">
                <p className="text-lg text-zinc-600 font-light leading-relaxed">
                  "I believe architecture should be a dialogue between past and present, 
                  honoring cultural heritage while embracing innovation. Every project is 
                  an opportunity to create spaces that tell stories and foster communities."
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <Award className="h-6 w-6 text-zinc-400 mt-1" />
                    <div>
                      <h4 className="font-light mb-2">Awards & Recognition</h4>
                      <p className="text-sm text-zinc-600 font-light">
                        Multiple architecture awards and industry recognition
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-6 w-6 text-zinc-400 mt-1" />
                    <div>
                      <h4 className="font-light mb-2">Years of Experience</h4>
                      <p className="text-sm text-zinc-600 font-light">
                        {new Date().getFullYear() - 2010}+ years in architectural practice
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="aspect-square bg-zinc-100 rounded-lg overflow-hidden">
                <Image
                  src="/api/placeholder/600/600"
                  alt="Architecture workspace"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="text-center"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-5xl lg:text-6xl font-light mb-8"
            >
              Let's <span className="italic font-extralight">Collaborate</span>
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-zinc-400 font-light leading-relaxed max-w-3xl mx-auto mb-12"
            >
              Interested in working with {teamMember.name} on your next project? 
              Get in touch to discuss how we can bring your vision to life.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <motion.div
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <Mail className="h-5 w-5 text-zinc-400" />
                <span className="text-lg font-light">officeofnativearchitects@gmail.com</span>
              </motion.div>
              
              <Link href="/#contact">
                <motion.button
                  className="flex items-center space-x-3 text-lg font-light uppercase tracking-wider border-b border-white pb-2 hover:text-zinc-300 hover:border-zinc-300 transition-colors group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Start a Project</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Other Team Members */}
      {otherMembers.length > 0 && (
        <section className="py-32 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="text-center mb-20">
                <h2 className="text-5xl lg:text-6xl font-light mb-6">
                  Meet Our <span className="italic font-extralight">Team</span>
                </h2>
                <p className="text-xl text-zinc-600 font-light max-w-3xl mx-auto">
                  Get to know the other talented professionals who make up our team.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {otherMembers.filter((member: any) => member.slug !== teamMember.slug).slice(0, 3).map((member: any) => (
                  <motion.div
                    key={member.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="group cursor-pointer"
                  >
                    <Link href={`/team/${member.slug}`}>
                      <div className="aspect-square bg-zinc-100 rounded-lg overflow-hidden mb-6">
                        <Image
                          src={member.profile_image_url || "/api/placeholder/400/400"}
                          alt={member.name}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      <h3 className="text-xl font-light mb-2 group-hover:text-zinc-600 transition-colors">
                        {member.name}
                      </h3>
                      
                      <p className="text-zinc-600 font-light mb-4">
                        {member.position}
                      </p>
                      
                      <div className="flex items-center space-x-2 text-sm text-zinc-400 group-hover:text-zinc-600 transition-colors">
                        <span>View Profile</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

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