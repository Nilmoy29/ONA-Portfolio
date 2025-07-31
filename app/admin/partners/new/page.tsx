"use client"

import { PartnerForm } from '@/components/admin/partner-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewPartnerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/partners" className="flex items-center text-zinc-600 hover:text-zinc-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Partners
        </Link>
      </div>

      <div>
        <h2 className="text-3xl font-light text-zinc-900">Create New Partner</h2>
        <p className="text-zinc-600">Add a new business partner or client</p>
      </div>

      <PartnerForm />
    </div>
  )
}