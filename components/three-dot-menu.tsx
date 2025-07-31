"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreHorizontal, X } from "lucide-react"

interface ThreeDotMenuProps {
  isDark?: boolean
}

export function ThreeDotMenu({ isDark = false }: ThreeDotMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`p-2 transition-colors ${
          isDark 
            ? "text-white hover:text-zinc-300" 
            : "text-zinc-900 hover:text-zinc-600"
        }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MoreHorizontal className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-zinc-200 py-2 z-50">
          <Link
            href="/about"
            className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            About Us
          </Link>
          <Link
            href="/careers"
            className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Careers
          </Link>
          <Link
            href="/news"
            className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            News & Updates
          </Link>
          <Link
            href="/sustainability"
            className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Sustainability
          </Link>
        </div>
      )}
    </div>
  )
}
