"use client"

import { AuthProvider } from '@/lib/auth-context'
import { SimpleAdminLayout } from '@/components/admin/simple-admin-layout'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <SimpleAdminLayout>
        {children}
      </SimpleAdminLayout>
    </AuthProvider>
  )
}