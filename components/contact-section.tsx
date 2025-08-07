"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

export function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  })
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false)
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [newsletterMessage, setNewsletterMessage] = useState('')

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    try {
      const response = await fetch('/api/public/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          subject: formData.subject || 'Contact Form Submission',
          message: formData.message
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSubmitStatus('success')
        setSubmitMessage(data.message)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: ''
        })
      } else {
        setSubmitStatus('error')
        setSubmitMessage(data.error || 'Failed to send message')
      }
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsNewsletterSubmitting(true)
    setNewsletterStatus('idle')
    
    try {
      const response = await fetch('/api/public/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newsletterEmail
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setNewsletterStatus('success')
        setNewsletterMessage(data.message)
        setNewsletterEmail('')
      } else {
        setNewsletterStatus('error')
        setNewsletterMessage(data.error || 'Failed to subscribe')
      }
    } catch (error) {
      setNewsletterStatus('error')
      setNewsletterMessage('Failed to subscribe. Please try again.')
    } finally {
      setIsNewsletterSubmitting(false)
      setTimeout(() => setNewsletterStatus('idle'), 5000)
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
    visible: { opacity: 1, y: 0 }
  }

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  }
  return (
    <section id="contact" className="py-16 bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="grid lg:grid-cols-2 gap-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          transition={{ 
            staggerChildren: 0.1,
            delayChildren: 0.2,
            duration: 0.6,
            ease: "easeOut"
          }}
        >
          <motion.div variants={itemVariants}>
            <motion.h2 
              className="text-5xl lg:text-6xl font-light mb-12"
              variants={itemVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Let's Create
              <br />
              <span className="italic font-extralight relative">
                Together
                <span className="absolute -bottom-2 left-0 w-24 h-0.5 bg-[#ff6b00]"></span>
              </span>
            </motion.h2>

            <motion.div 
              className="space-y-8 mb-12" 
              variants={itemVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div 
                className="flex items-start space-x-4"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Mail className="h-6 w-6 text-[#ff6b00] mt-1" />
                <div>
                  <p className="text-zinc-400 text-sm font-light uppercase tracking-wider mb-1">Email</p>
                  <p className="text-xl font-light">info@ona.com.bd</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start space-x-4"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Phone className="h-6 w-6 text-[#ff6b00] mt-1" />
                <div>
                  <p className="text-zinc-400 text-sm font-light uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-xl font-light">01721115555</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start space-x-4"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MapPin className="h-6 w-6 text-[#ff6b00] mt-1" />
                <div>
                  <p className="text-zinc-400 text-sm font-light uppercase tracking-wider mb-1">Studio</p>
                  <p className="text-xl font-light">
                  Asia Park, Dania, Dhaka,
                    <br />
                    BANGLADESH
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              className="space-y-4" 
              variants={itemVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="text-zinc-400 text-sm font-light uppercase tracking-wider">Follow Us</p>
              <div className="flex space-x-6">
                <motion.a
                  href="https://www.linkedin.com/company/ona-office-of-native-architects/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-[#ff6b00] transition-colors font-light"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  LinkedIn
                </motion.a>
                <motion.a
                  href="#"
                  className="text-zinc-400 hover:text-[#ff6b00] transition-colors font-light"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Instagram
                </motion.a>
                <motion.a
                  href="https://www.facebook.com/people/ONA-I-Office-of-Native-Architects/61574622031136/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-[#ff6b00] transition-colors font-light"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Facebook
                </motion.a>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={formVariants}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <form onSubmit={handleFormSubmit} className="space-y-8">
                              <motion.div 
                  className="grid md:grid-cols-2 gap-8"
                  variants={itemVariants}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                <motion.input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full bg-transparent border-b border-zinc-700 pb-4 text-xl font-light placeholder-zinc-500 focus:outline-none focus:border-[#ff6b00] transition-colors"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full bg-transparent border-b border-zinc-700 pb-4 text-xl font-light placeholder-zinc-500 focus:outline-none focus:border-[#ff6b00] transition-colors"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>
              <motion.input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-transparent border-b border-zinc-700 pb-4 text-xl font-light placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                required
                variants={itemVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="text"
                placeholder="Project Type"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full bg-transparent border-b border-zinc-700 pb-4 text-xl font-light placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                variants={itemVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileFocus={{ scale: 1.02 }}
              />
              <motion.textarea
                rows={4}
                placeholder="Tell us about your project"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-transparent border-b border-zinc-700 pb-4 text-xl font-light placeholder-zinc-500 focus:outline-none focus:border-[#ff6b00] transition-colors resize-none"
                required
                variants={itemVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileFocus={{ scale: 1.02 }}
              />
              
              {/* Submit Status */}
              {submitStatus !== 'idle' && (
                <motion.div 
                  className={`flex items-center space-x-2 text-sm ${
                    submitStatus === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {submitStatus === 'success' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <span>{submitMessage}</span>
                </motion.div>
              )}
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-3 text-xl font-light uppercase tracking-wider border border-[#ff6b00] text-[#ff6b00] px-8 py-4 hover:bg-[#ff6b00] hover:text-black transition-all duration-300 group disabled:opacity-50"
                variants={itemVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </form>

            {/* Newsletter Signup */}
            <motion.div 
              className="mt-16 pt-16 border-t border-zinc-700"
              variants={itemVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h3 className="text-2xl font-light mb-6">Stay Updated</h3>
              <p className="text-zinc-400 font-light mb-6">
                Subscribe to our newsletter for the latest projects, insights, and architectural innovations.
              </p>
              
              {/* Newsletter Status */}
              {newsletterStatus !== 'idle' && (
                <motion.div 
                  className={`flex items-center space-x-2 text-sm mb-4 ${
                    newsletterStatus === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {newsletterStatus === 'success' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <span>{newsletterMessage}</span>
                </motion.div>
              )}
              
              <form onSubmit={handleNewsletterSubmit} className="flex">
                <motion.input
                  type="email"
                  placeholder="Your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-transparent border-b border-zinc-700 pb-4 text-lg font-light placeholder-zinc-500 focus:outline-none focus:border-[#ff6b00] transition-colors"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button 
                  type="submit"
                  disabled={isNewsletterSubmitting}
                  className="ml-4 text-lg font-light uppercase tracking-wider border-b border-[#ff6b00] text-[#ff6b00] pb-4 hover:text-white hover:border-white transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isNewsletterSubmitting ? 'Subscribing...' : 'Subscribe'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
