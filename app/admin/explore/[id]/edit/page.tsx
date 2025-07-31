"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ContentForm } from '@/components/admin/content-form'
import { ExploreContent } from '@/lib/database-types'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function EditContentPage() {
  const params = useParams()
  const [content, setContent] = useState<ExploreContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchContent()
  }, [params.id])

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/admin/explore/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setContent(data.data)
      } else {
        setError(data.error || 'Failed to fetch content')
      }
    } catch (error) {
      console.error('Error fetching content:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-8">Loading content...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!content) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Content not found</AlertDescription>
      </Alert>
    )
  }

  return <ContentForm content={content} isEdit={true} />
}