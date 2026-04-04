"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { TeamMemberForm } from '@/components/admin/team-member-form'
import { TeamMember } from '@/lib/database-types'

export default function EditTeamMemberPage() {
  const params = useParams()
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchTeamMember(params.id as string)
    }
  }, [params.id])

  const fetchTeamMember = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/team/${id}`)
      const data = await response.json()

      if (response.ok) {
        setTeamMember(data.data)
      } else {
        setError(data.error || 'Failed to fetch team member')
      }
    } catch (error) {
      console.error('Error fetching team member:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-light text-zinc-900">Edit Team Member</h2>
          <p className="text-zinc-600">Loading team member information...</p>
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
          <h2 className="text-3xl font-light text-zinc-900">Edit Team Member</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!teamMember) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-light text-zinc-900">Edit Team Member</h2>
          <p className="text-zinc-600">Team member not found</p>
        </div>
      </div>
    )
  }

  return <TeamMemberForm teamMember={teamMember} isEdit={true} />
}