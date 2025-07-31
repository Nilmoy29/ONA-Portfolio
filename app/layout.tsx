import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ONA - Office of Native Architects',
  description: 'Office of Native Architects',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
