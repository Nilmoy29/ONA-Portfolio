"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { ArrowRight, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/public/services')
      const data = await response.json()
      setServices(data.data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
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

  const servicesByType = services.reduce((acc: any, service: any) => {
    const type = service.service_type || 'general'
    if (!acc[type]) acc[type] = []
    acc[type].push(service)
    return acc
  }, {})

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
            className="text-center"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-6xl lg:text-7xl font-light mb-8"
            >
              Our <span className="italic font-extralight">Services</span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-zinc-600 font-light leading-relaxed max-w-4xl mx-auto"
            >
              We offer a comprehensive range of architectural services that blend traditional wisdom 
              with contemporary innovation. From conceptual design to project completion, we guide 
              you through every step of your architectural journey.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {Object.entries(servicesByType).map(([type, serviceList]: [string, any]) => (
            <motion.div
              key={type}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={containerVariants}
              className="mb-20"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-3xl lg:text-4xl font-light mb-12 capitalize"
              >
                {type.replace('_', ' ')} Services
              </motion.h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {serviceList.map((service: any, index: number) => (
                  <motion.div
                    key={service.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="group cursor-pointer"
                  >
                    <Link href={`/services/${service.slug}`}>
                      <div className="aspect-[4/3] bg-zinc-100 rounded-lg overflow-hidden mb-6">
                        <Image
                          src={service.featured_image_url || "/api/placeholder/400/300"}
                          alt={service.name}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        {service.icon && (
                          <div className="w-6 h-6 bg-zinc-200 rounded-full flex items-center justify-center">
                            <span className="text-xs">{service.icon}</span>
                          </div>
                        )}
                        <h3 className="text-xl font-light group-hover:text-zinc-600 transition-colors">
                          {service.name}
                        </h3>
                      </div>
                      
                      <p className="text-zinc-600 font-light leading-relaxed mb-4 line-clamp-3">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center space-x-2 text-sm text-zinc-400 group-hover:text-zinc-600 transition-colors">
                        <span>Learn More</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process Section */}
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
                Our <span className="italic font-extralight">Process</span>
              </h2>
              <p className="text-xl text-zinc-400 font-light max-w-3xl mx-auto">
                Every project follows a carefully crafted process that ensures excellence 
                from concept to completion.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Discovery",
                  description: "We begin by understanding your vision, needs, and the cultural context of your project."
                },
                {
                  step: "02",
                  title: "Design",
                  description: "Our team develops creative solutions that honor tradition while embracing innovation."
                },
                {
                  step: "03",
                  title: "Development",
                  description: "We refine the design through collaboration, ensuring every detail serves your goals."
                },
                {
                  step: "04",
                  title: "Delivery",
                  description: "We oversee construction and completion, ensuring your vision becomes reality."
                }
              ].map((phase, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="text-4xl font-light text-zinc-600 mb-4">{phase.step}</div>
                  <h3 className="text-xl font-light mb-4">{phase.title}</h3>
                  <p className="text-zinc-400 font-light leading-relaxed">{phase.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
              Ready to Start Your <span className="italic font-extralight">Project?</span>
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-zinc-600 font-light leading-relaxed max-w-3xl mx-auto mb-12"
            >
              Let's discuss how we can bring your architectural vision to life. 
              Our team is ready to guide you through every step of the process.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/#contact">
                <motion.button
                  className="flex items-center space-x-3 text-lg font-light uppercase tracking-wider border-b border-black pb-2 hover:text-zinc-600 hover:border-zinc-600 transition-colors group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Start a Project</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              
              <Link href="/about">
                <motion.button
                  className="flex items-center space-x-3 text-lg font-light uppercase tracking-wider text-zinc-600 hover:text-black transition-colors group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Learn More</span>
                  <ExternalLink className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
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