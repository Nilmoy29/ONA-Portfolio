"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ServiceForm } from '@/components/admin/service-form'
import { Service } from '@/lib/database-types'

export default function EditServicePage() {
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

      if (response.ok) {
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
        <div>
          <h2 className="text-3xl font-light text-zinc-900">Edit Service</h2>
          <p className="text-zinc-600">Loading service information...</p>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-zinc-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-light text-zinc-900">Edit Service</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-light text-zinc-900">Edit Service</h2>
          <p className="text-zinc-600">Service not found</p>
        </div>
      </div>
    )
  }

  return <ServiceForm service={service} isEdit={true} />
}