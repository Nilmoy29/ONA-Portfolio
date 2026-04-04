"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Edit, ExternalLink, Building } from 'lucide-react'
import { Partner } from '@/lib/database-types'

export default function PartnerViewPage() {
  const router = useRouter()
  const params = useParams()
  const [partner, setPartner] = useState<Partner | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchPartner(params.id as string)
    }
  }, [params.id])

  const fetchPartner = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/partners/${id}`)
      const data = await response.json()

      if (response.ok && data.data) {
        setPartner(data.data)
      } else {
        setError(data.error || 'Failed to fetch partner')
      }
    } catch (error) {
      console.error('Error fetching partner:', error)
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
            <Link href="/admin/partners">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Partners
            </Link>
          </Button>
        </div>
        <div className="text-center py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-zinc-200 rounded-lg"></div>
          </div>
          <p className="mt-4 text-zinc-500">Loading partner...</p>
        </div>
      </div>
    )
  }

  if (error || !partner) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/partners">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Partners
            </Link>
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error || 'Partner not found'}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/partners">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Partners
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-light text-zinc-900">{partner.name}</h1>
            <p className="text-zinc-600">Partner Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/partners/${partner.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Partner
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Partner Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-700">Name</label>
                <p className="text-zinc-900">{partner.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700">Slug</label>
                <p className="text-zinc-600 font-mono">{partner.slug}</p>
              </div>

              {partner.description && (
                <div>
                  <label className="text-sm font-medium text-zinc-700">Description</label>
                  <p className="text-zinc-900 whitespace-pre-wrap">{partner.description}</p>
                </div>
              )}

              {partner.website_url && (
                <div>
                  <label className="text-sm font-medium text-zinc-700">Website</label>
                  <div className="flex items-center gap-2">
                    <a 
                      href={partner.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {partner.website_url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-zinc-700">Status</label>
                <div className="mt-1">
                  <Badge variant={partner.is_published ? 'default' : 'secondary'}>
                    {partner.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700">Sort Order</label>
                <p className="text-zinc-900">{partner.sort_order || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {partner.logo_url ? (
                  <div className="space-y-4">
                    <img 
                      src={partner.logo_url} 
                      alt={partner.name}
                      className="w-32 h-32 object-contain mx-auto rounded-lg border"
                    />
                    <a 
                      href={partner.logo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center justify-center gap-1"
                    >
                      View Full Size
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-zinc-100 rounded-lg flex items-center justify-center mx-auto">
                    <Building className="w-12 h-12 text-zinc-400" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-zinc-700">Created</label>
                <p className="text-sm text-zinc-600">
                  {new Date(partner.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">Last Updated</label>
                <p className="text-sm text-zinc-600">
                  {new Date(partner.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}