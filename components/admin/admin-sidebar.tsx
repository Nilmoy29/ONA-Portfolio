"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  Briefcase, 
  FileText, 
  Heart, 
  Mail, 
  Settings, 
  UserCog,
  Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: Building },
  { name: 'Team Members', href: '/admin/team', icon: Users },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'Explore Content', href: '/admin/explore', icon: FileText },
  { name: 'Partners', href: '/admin/partners', icon: Heart },
  { name: 'Contact Submissions', href: '/admin/contact', icon: Mail },
  { name: 'Admin Users', href: '/admin/users', icon: UserCog },
  { name: 'Media Library', href: '/admin/media', icon: FileText },
  { name: 'Site Settings', href: '/admin/settings', icon: Settings },
  { name: 'Activity Logs', href: '/admin/logs', icon: Activity },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-zinc-800">
        <Link href="/admin" className="text-xl font-light hover:text-zinc-300 transition-colors">
          ONA Admin
        </Link>
      </div>
      
      <nav className="mt-8 space-y-1 px-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (
            item.href !== '/admin' && pathname.startsWith(item.href + '/')
          )
          
          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch={true}
              className={cn(
                'flex items-center px-3 py-2 text-sm rounded-lg transition-colors group',
                isActive
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              )}
            >
              <item.icon className={cn(
                'mr-3 h-4 w-4 transition-colors',
                isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'
              )} />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800">
        <div className="text-xs text-zinc-500 text-center">
          <p>Office of Native Architects</p>
          <p className="mt-1">Admin Panel v1.0</p>
        </div>
      </div>
    </div>
  )
}