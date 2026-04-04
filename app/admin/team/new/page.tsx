import { TeamMemberForm } from '@/components/admin/team-member-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add New Team Member | ONA Admin',
  description: 'Add a new team member to the ONA portfolio',
}

export default function NewTeamMemberPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Add New Team Member</h1>
            <p className="text-zinc-600 mt-1">
              Create a comprehensive profile for a new team member including professional background, skills, and contact information.
            </p>
          </div>
        </div>
      </div>
      
      <TeamMemberForm />
    </div>
  )
}