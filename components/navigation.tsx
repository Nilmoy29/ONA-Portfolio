"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThreeDotMenu } from "./three-dot-menu"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [currentSection, setCurrentSection] = useState("hero")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        let maxIntersection = 0
        let activeSection = currentSection
        
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxIntersection) {
            maxIntersection = entry.intersectionRatio
            activeSection = entry.target.id
          }
        })
        
        if (maxIntersection > 0) {
          setCurrentSection(activeSection)
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
        rootMargin: "-80px 0px -80px 0px"
      }
    )

    const sections = document.querySelectorAll("section[id]")
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  const navItems = [
    { name: "Services", href: "/#services" },
    { name: "Projects", href: "/projects" },
    { name: "Team", href: "/team" },
    { name: "Explore", href: "/explore" },
    { name: "Contact", href: "/#contact" },
  ]

  // For demo: Always use black background with white logo
  const shouldUseWhiteLogo = true

  return (
    <>
      {/* Solid bg-black on mobile: Android often fails on backdrop-filter, causing white bleed. left-0 right-0 for reliable full-width on fixed. */}
      <nav className="fixed top-0 left-0 right-0 w-full z-40 transition-all duration-500 bg-black lg:bg-black/95 lg:backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[var(--safe-top)]">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="relative z-50">
              <motion.div
                initial={false}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut"
                }}
                className="relative"
              >
                <Image
                  src="/ona-logo-white.png"
                  alt="ONA"
                  width={160}
                  height={48}
                  className="max-h-10 w-auto h-auto object-contain transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                />
              </motion.div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium tracking-wider uppercase transition-all duration-300 relative group text-white hover:text-zinc-300"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/70 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
              <div className="transition-all duration-300 text-white">
                <ThreeDotMenu isDark={true} />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden z-50 transition-all duration-300 text-white hover:text-zinc-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-zinc-900 z-30 transition-all duration-500 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-8">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-2xl font-light text-white tracking-wider uppercase hover:text-zinc-300 transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
