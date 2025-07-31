"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft, 
  Edit, 
  Calendar,
  Loader2,
  Eye,
  EyeOff,
  Briefcase,
  Settings,
  Building,
  Palette,
  Wrench
} from 'lucide-react'
import { Service } from '@/lib/database-types'

const getServiceIcon = (serviceType: string) => {
  switch (serviceType) {
    case 'design': return Palette
    case 'consulting': return Briefcase
    case 'construction': return Building
    case 'maintenance': return Wrench
    default: return Settings
  }
}

const getServiceTypeColor = (serviceType: string) => {
  switch (serviceType) {
    case 'design': return 'bg-purple-100 text-purple-800'
    case 'consulting': return 'bg-blue-100 text-blue-800'
    case 'construction': return 'bg-green-100 text-green-800'
    case 'maintenance': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const formatServiceType = (serviceType: string) => {
  return serviceType.charAt(0).toUpperCase() + serviceType.slice(1)
}

export default function ServiceDetailPage() {
  const params = useParams()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchService(params.id as string)
    }
  }, [params.id])

  const fetchService = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/services/${id}`)
      const data = await response.json()

      if (response.ok && data.data) {
        setService(data.data)
      } else {
        setError(data.error || 'Failed to fetch service')
      }
    } catch (error) {
      console.error('Error fetching service:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/services">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Link>
          </Button>
        </div>
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2 text-zinc-500">Loading service...</p>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/services">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Link>
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error || 'Service not found'}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const ServiceIcon = getServiceIcon(service.service_type || 'other')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/services">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center">
              {service.icon ? (
                <span className="text-2xl">{service.icon}</span>
              ) : (
                <ServiceIcon className="w-6 h-6 text-zinc-600" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-light text-zinc-900">{service.name}</h1>
              <p className="text-zinc-600">Service Details</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={service.is_published ? 'default' : 'secondary'}>
            {service.is_published ? (
              <>
                <Eye className="h-3 w-3 mr-1" />
                Published
              </>
            ) : (
              <>
                <EyeOff className="h-3 w-3 mr-1" />
                Draft
              </>
            )}
          </Badge>
          <Button asChild>
            <Link href={`/admin/services/${service.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Service
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          {service.featured_image_url && (
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={service.featured_image_url}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle>Service Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {service.description ? (
                  <div className="text-zinc-700 whitespace-pre-wrap">{service.description}</div>
                ) : (
                  <p className="text-zinc-500 italic">No description provided</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Service Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Service Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-zinc-900 mb-2">Service Type</h4>
                    <Badge className={getServiceTypeColor(service.service_type || 'other')}>
                      <ServiceIcon className="w-3 h-3 mr-1" />
                      {formatServiceType(service.service_type || 'other')}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-zinc-900 mb-2">Status</h4>
                    <Badge variant={service.is_published ? 'default' : 'secondary'}>
                      {service.is_published ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-zinc-900 mb-2">Display Order</h4>
                    <p className="text-zinc-600">{service.sort_order || 0}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-zinc-900 mb-2">Slug</h4>
                    <code className="bg-zinc-100 px-2 py-1 rounded text-sm">
                      {service.slug}
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle>Service Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-500">Service ID</label>
                <div className="mt-1">
                  <code className="text-xs bg-zinc-100 px-2 py-1 rounded">
                    {service.id.slice(0, 8)}...
                  </code>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-500">Icon</label>
                <div className="mt-1">
                  {service.icon ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{service.icon}</span>
                      <code className="text-xs bg-zinc-100 px-2 py-1 rounded">
                        {service.icon}
                      </code>
                    </div>
                  ) : (
                    <span className="text-sm text-zinc-500">No icon set</span>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-zinc-500">Created</label>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm">{new Date(service.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-500">Last Updated</label>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm">{new Date(service.updated_at).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href={`/admin/services/${service.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Service
                </Link>
              </Button>
              
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/admin/services">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Services
                </Link>
              </Button>

              {service.is_published && (
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  View on Website
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}