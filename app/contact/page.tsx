"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface ContactFormData {
  name: string
  email: string
  message: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setFormData({ name: '', email: '', message: '' })
      } else {
        setError(data.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-zinc-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-light text-zinc-900 mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
              Ready to start your project? Get in touch with our team of architects 
              and designers to discuss your vision.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-light text-zinc-900 mb-6">
                Get In Touch
              </h2>
              <p className="text-zinc-600 text-lg leading-relaxed">
                We believe in the power of collaboration and would love to hear about your project. 
                Whether you're planning a new build, renovation, or looking for design consultation, 
                our team is here to help bring your vision to life.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-zinc-600" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-900 font-medium">hello@ona-architects.com</p>
                  <p className="text-zinc-600 text-sm mt-1">
                    We typically respond within 24 hours
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-zinc-600" />
                    Phone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-900 font-medium">+1 (555) 123-4567</p>
                  <p className="text-zinc-600 text-sm mt-1">
                    Monday - Friday, 9:00 AM - 6:00 PM
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-zinc-600" />
                    Office Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-900 font-medium">
                    123 Architecture Lane<br />
                    Design District<br />
                    Toronto, ON M5V 3A8
                  </p>
                  <p className="text-zinc-600 text-sm mt-2">
                    Visits by appointment only
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-zinc-600" />
                    Office Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Monday - Friday</span>
                      <span className="text-zinc-900 font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Saturday</span>
                      <span className="text-zinc-900 font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Sunday</span>
                      <span className="text-zinc-900 font-medium">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {success && (
                  <Alert className="mb-6">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Thank you for your message! We'll get back to you within 24 hours.
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-2">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-zinc-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project, timeline, and any specific requirements..."
                      disabled={loading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={loading || !formData.name || !formData.email || !formData.message}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-zinc-500 text-center">
                    By sending this message, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <div className="mt-8 p-6 bg-zinc-50 rounded-lg">
              <h3 className="font-medium text-zinc-900 mb-3">What happens next?</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-zinc-200 rounded-full flex items-center justify-center text-xs font-medium text-zinc-700 mt-0.5">1</span>
                  We'll review your message and project requirements
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-zinc-200 rounded-full flex items-center justify-center text-xs font-medium text-zinc-700 mt-0.5">2</span>
                  Our team will reach out within 24 hours
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-zinc-200 rounded-full flex items-center justify-center text-xs font-medium text-zinc-700 mt-0.5">3</span>
                  We'll schedule a consultation to discuss your vision
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}