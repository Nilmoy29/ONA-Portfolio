"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { ArrowRight, ArrowLeft, CheckCircle, Phone, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function ServiceDetailPage() {
  const params = useParams()
  const [service, setService] = useState<any>(null)
  const [relatedServices, setRelatedServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.slug) {
      fetchService()
      fetchRelatedServices()
    }
  }, [params.slug])

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/public/services/${params.slug}`)
      const data = await response.json()
      setService(data.data)
    } catch (error) {
      console.error('Error fetching service:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedServices = async () => {
    try {
      const response = await fetch('/api/public/services?limit=3')
      const data = await response.json()
      setRelatedServices(data.data || [])
    } catch (error) {
      console.error('Error fetching related services:', error)
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

  const features = [
    "Comprehensive site analysis and cultural context assessment",
    "Sustainable design practices and material selection",
    "Community engagement and stakeholder consultation",
    "Detailed architectural drawings and specifications",
    "Construction oversight and project management",
    "Post-completion evaluation and maintenance planning"
  ]

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

  if (!service) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 pb-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-light mb-4">Service Not Found</h1>
            <p className="text-zinc-600 mb-8">The service you're looking for doesn't exist.</p>
            <Link href="/services">
              <button className="flex items-center space-x-2 text-lg font-light uppercase tracking-wider border-b border-black pb-2 hover:text-zinc-600 hover:border-zinc-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Services</span>
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
          <Link href="/services">
            <motion.button
              className="flex items-center space-x-2 text-lg font-light uppercase tracking-wider text-zinc-600 hover:text-black transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Services</span>
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={itemVariants}>
              <div className="flex items-center space-x-3 mb-6">
                {service.icon && (
                  <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center">
                    <span className="text-sm">{service.icon}</span>
                  </div>
                )}
                <span className="text-sm text-zinc-600 font-light uppercase tracking-wider">
                  {service.service_type?.replace('_', ' ')}
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-light mb-8">
                {service.name}
              </h1>
              
              <p className="text-xl text-zinc-600 font-light leading-relaxed mb-8">
                {service.description}
              </p>
              
              <motion.button
                className="flex items-center space-x-3 text-lg font-light uppercase tracking-wider border-b border-black pb-2 hover:text-zinc-600 hover:border-zinc-600 transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="aspect-square bg-zinc-100 rounded-lg overflow-hidden">
                <Image
                  src={service.featured_image_url || "/api/placeholder/600/600"}
                  alt={service.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What's Included */}
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
                What's <span className="italic font-extralight">Included</span>
              </h2>
              <p className="text-xl text-zinc-600 font-light max-w-3xl mx-auto">
                Our comprehensive service includes everything you need for a successful project.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start space-x-4"
                >
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-zinc-600 font-light leading-relaxed">{feature}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-20">
              <h2 className="text-5xl lg:text-6xl font-light mb-6">
                Our <span className="italic font-extralight">Approach</span>
              </h2>
              <p className="text-xl text-zinc-600 font-light max-w-3xl mx-auto">
                We follow a proven methodology that ensures exceptional results for every project.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  title: "Discovery & Research",
                  description: "We begin by understanding your unique requirements, cultural context, and project goals through comprehensive research and consultation."
                },
                {
                  title: "Design & Development",
                  description: "Our team creates innovative solutions that blend traditional wisdom with contemporary design principles, ensuring functionality and beauty."
                },
                {
                  title: "Implementation & Support",
                  description: "We guide you through the entire implementation process, providing ongoing support and ensuring your vision becomes reality."
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-light">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-light mb-4">{step.title}</h3>
                  <p className="text-zinc-600 font-light leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
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
              Ready to Get <span className="italic font-extralight">Started?</span>
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-zinc-400 font-light leading-relaxed max-w-3xl mx-auto mb-12"
            >
              Let's discuss how our {service.name.toLowerCase()} service can bring your vision to life. 
              Contact us today to schedule a consultation.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <motion.div
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <Phone className="h-5 w-5 text-zinc-400" />
                <span className="text-lg font-light">01721115555</span>
              </motion.div>
              
              <motion.div
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <Mail className="h-5 w-5 text-zinc-400" />
                <span className="text-lg font-light">officeofnativearchitects@gmail.com</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
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
                  Related <span className="italic font-extralight">Services</span>
                </h2>
                <p className="text-xl text-zinc-600 font-light max-w-3xl mx-auto">
                  Explore our other services that might complement your project.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {relatedServices.filter((s: any) => s.slug !== service.slug).slice(0, 3).map((relatedService: any) => (
                  <motion.div
                    key={relatedService.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="group cursor-pointer"
                  >
                    <Link href={`/services/${relatedService.slug}`}>
                      <div className="aspect-[4/3] bg-zinc-100 rounded-lg overflow-hidden mb-6">
                        <Image
                          src={relatedService.featured_image_url || "/api/placeholder/400/300"}
                          alt={relatedService.name}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      <h3 className="text-xl font-light mb-2 group-hover:text-zinc-600 transition-colors">
                        {relatedService.name}
                      </h3>
                      
                      <p className="text-zinc-600 font-light leading-relaxed mb-4 line-clamp-2">
                        {relatedService.description}
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