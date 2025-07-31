"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { ArrowRight, Users, Award, Globe, Calendar, MapPin, Phone, Mail } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/public/team')
      const data = await response.json()
      setTeamMembers(data.data || [])
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setLoading(false)
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

  const stats = [
    { number: "50+", label: "Projects Completed" },
    { number: "15+", label: "Years Experience" },
    { number: "25+", label: "Team Members" },
    { number: "12+", label: "Awards Won" }
  ]

  const values = [
    {
      title: "Cultural Sensitivity",
      description: "We honor indigenous wisdom and cultural narratives in every design, ensuring our architecture respects and celebrates local traditions.",
      icon: Globe
    },
    {
      title: "Sustainable Design",
      description: "Environmental responsibility is at the core of our practice. We create buildings that work in harmony with nature.",
      icon: Award
    },
    {
      title: "Community Engagement",
      description: "We believe in collaborative design processes that involve communities from conception to completion.",
      icon: Users
    },
    {
      title: "Innovation",
      description: "We embrace contemporary technology and innovative solutions while staying true to our cultural roots.",
      icon: ArrowRight
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-6xl lg:text-7xl font-light mb-8">
                About
                <br />
                <span className="italic font-extralight">Our Studio</span>
              </h1>
              <p className="text-xl text-zinc-600 font-light leading-relaxed mb-8">
                Office of Native Architects is a forward-thinking architectural practice that bridges 
                indigenous wisdom with contemporary innovation. We create spaces that honor cultural 
                heritage while embracing the future.
              </p>
              <motion.button
                className="flex items-center space-x-3 text-lg font-light uppercase tracking-wider border-b border-black pb-2 hover:text-zinc-600 hover:border-zinc-600 transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Our Story</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="relative"
            >
              <div className="aspect-square bg-zinc-100 rounded-lg overflow-hidden">
                <Image
                  src="/api/placeholder/600/600"
                  alt="ONA Studio"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div 
                className="absolute -bottom-6 -right-6 bg-black text-white p-6 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-2xl font-light">Est. 2009</p>
                <p className="text-sm text-zinc-400 font-light">Dhaka, Bangladesh</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="grid md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-4xl lg:text-5xl font-light mb-2">{stat.number}</h3>
                <p className="text-zinc-600 font-light">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-20">
              <h2 className="text-5xl lg:text-6xl font-light mb-6">
                Our <span className="italic font-extralight">Values</span>
              </h2>
              <p className="text-xl text-zinc-600 font-light max-w-3xl mx-auto">
                Every project we undertake is guided by core values that shape our approach 
                to architecture and design.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-16">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="mb-6">
                    <value.icon className="h-8 w-8 text-zinc-400 group-hover:text-black transition-colors" />
                  </div>
                  <h3 className="text-2xl font-light mb-4">{value.title}</h3>
                  <p className="text-zinc-600 font-light leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-32 bg-zinc-900 text-white">
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
              <p className="text-xl text-zinc-400 font-light max-w-3xl mx-auto">
                Our diverse team brings together architects, designers, and thinkers who share 
                a passion for creating meaningful spaces.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {teamMembers.slice(0, 3).map((member: any, index: number) => (
                <motion.div
                  key={member.id}
                  variants={itemVariants}
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="aspect-square bg-zinc-800 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={member.profile_image_url || "/api/placeholder/400/400"}
                      alt={member.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-light mb-2">{member.name}</h3>
                  <p className="text-zinc-400 font-light">{member.position}</p>
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants} className="text-center">
              <motion.button
                className="flex items-center space-x-3 text-lg font-light uppercase tracking-wider border-b border-white pb-2 hover:text-zinc-300 hover:border-zinc-300 transition-colors group mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>View All Team Members</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="grid lg:grid-cols-2 gap-16"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-5xl lg:text-6xl font-light mb-8">
                Get In <span className="italic font-extralight">Touch</span>
              </h2>
              <p className="text-xl text-zinc-600 font-light leading-relaxed mb-8">
                Ready to start your next project? We'd love to hear from you and discuss 
                how we can bring your vision to life.
              </p>
              
              <div className="space-y-6">
                <motion.div 
                  className="flex items-center space-x-4"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <MapPin className="h-6 w-6 text-zinc-400" />
                  <div>
                    <p className="text-zinc-600 font-light">123 Architecture Ave, Dhaka</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center space-x-4"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Phone className="h-6 w-6 text-zinc-400" />
                  <div>
                    <p className="text-zinc-600 font-light">01721115555</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center space-x-4"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Mail className="h-6 w-6 text-zinc-400" />
                  <div>
                    <p className="text-zinc-600 font-light">officeofnativearchitects@gmail.com</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="aspect-square bg-zinc-200 rounded-lg overflow-hidden">
                <Image
                  src="/api/placeholder/600/600"
                  alt="ONA Office"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
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
                <li><a href="/#services" className="hover:text-white transition-colors">Services</a></li>
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