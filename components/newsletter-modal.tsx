"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NewsletterModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')
    
    try {
      const response = await fetch('/api/public/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || null
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setStatus('success')
        setMessage(data.message)
        setEmail('')
        setName('')
        // Auto close after 3 seconds on success
        setTimeout(() => {
          onClose()
          setStatus('idle')
          setMessage('')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to subscribe')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
      // Clear status after 5 seconds
      setTimeout(() => {
        if (status !== 'success') {
          setStatus('idle')
          setMessage('')
        }
      }, 5000)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      // Reset form state when closing
      setEmail('')
      setName('')
      setStatus('idle')
      setMessage('')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 transition-colors disabled:opacity-50 z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-zinc-900 to-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-light text-zinc-900 mb-2">
                  Stay <span className="italic font-extralight">Inspired</span>
                </h2>
                <p className="text-zinc-600 font-light">
                  Get the latest insights, projects, and architectural discoveries delivered to your inbox.
                </p>
              </div>

              {/* Status Message */}
              {status !== 'idle' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center space-x-2 text-sm mb-6 p-3 rounded-lg ${
                    status === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {status === 'success' ? (
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span>{message}</span>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 px-4 border-zinc-200 focus:border-zinc-400 transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 border-zinc-200 focus:border-zinc-400 transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || !email.trim()}
                  className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white font-light disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Subscribing...</span>
                    </div>
                  ) : (
                    'Subscribe to Newsletter'
                  )}
                </Button>
              </form>

              {/* Footer */}
              <p className="text-xs text-zinc-500 text-center mt-6">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-zinc-100 to-transparent opacity-50 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-zinc-100 to-transparent opacity-50 rounded-full translate-y-12 -translate-x-12" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 