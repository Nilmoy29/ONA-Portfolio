"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { PartnerForm } from '@/components/admin/partner-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Partner } from '@/lib/database-types'

export default function EditPartnerPage() {
  const params = useParams()
  const [partner, setPartner] = useState<Partner | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPartner()
  }, [params.id])

  const fetchPartner = async () => {
    try {
      const response = await fetch(`/api/admin/partners/${params.id}`, {
        method: 'GET',
        credentials: 'include', // Important for session cookies
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to login if unauthorized
          window.location.href = '/admin/login'
          return
        }
        throw new Error('Failed to fetch partner')
      }
      const data = await response.json()
      setPartner(data.data)
    } catch (err: any) {
      console.error('Error fetching partner:', err)
      if (err.message.includes('Unauthorized') || err.message.includes('401')) {
        window.location.href = '/admin/login'
        return
      }
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/partners" className="flex items-center text-zinc-600 hover:text-zinc-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Partners
          </Link>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
        </div>
      </div>
    )
  }

  if (error || !partner) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/partners" className="flex items-center text-zinc-600 hover:text-zinc-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Partners
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-light text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-600">{error || 'Partner not found'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/partners" className="flex items-center text-zinc-600 hover:text-zinc-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Partners
        </Link>
      </div>

      <div>
        <h2 className="text-3xl font-light text-zinc-900">Edit Partner</h2>
        <p className="text-zinc-600">Update partner information for {partner.name}</p>
      </div>

      <PartnerForm partner={partner} isEdit={true} />
    </div>
  )
}