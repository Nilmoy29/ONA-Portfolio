"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ProjectForm } from '@/components/admin/project-form'
import { Project } from '@/lib/database-types'

export default function EditProjectPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string)
    }
  }, [params.id])

  const fetchProject = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/projects/${id}`)
      const data = await response.json()

      if (response.ok) {
        setProject(data.data)
      } else {
        setError(data.error || 'Failed to fetch project')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-light text-zinc-900">Edit Project</h2>
          <p className="text-zinc-600">Loading project information...</p>
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
          <h2 className="text-3xl font-light text-zinc-900">Edit Project</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-light text-zinc-900">Edit Project</h2>
          <p className="text-zinc-600">Project not found</p>
        </div>
      </div>
    )
  }

  return <ProjectForm project={project} isEdit={true} />
}