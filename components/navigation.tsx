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

  // Define which sections have dark backgrounds (use white logo)
  const darkSections = ["hero", "projects", "contact"]
  const shouldUseWhiteLogo = darkSections.includes(currentSection)

  return (
    <>
      <nav className={`fixed top-0 w-full z-40 transition-all duration-500 ${
        shouldUseWhiteLogo 
          ? "bg-black/20 backdrop-blur-md" 
          : "bg-white/90 backdrop-blur-md shadow-sm"
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
                <AnimatePresence mode="wait">
                  <motion.div
                    key={shouldUseWhiteLogo ? "white" : "black"}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                  >
                    <Image
                      src={shouldUseWhiteLogo ? "/ona-logo-white.png" : "/ona-logo-black.png"}
                      alt="ONA"
                      width={200}
                      height={70}
                      className={`w-auto transition-all duration-300 ${
                        shouldUseWhiteLogo 
                          ? "h-14 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" 
                          : "h-10 drop-shadow-[0_2px_4px_rgba(255,255,255,0.6)]"
                      }`}
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium tracking-wider uppercase transition-all duration-300 relative group ${
                    shouldUseWhiteLogo 
                      ? "text-white hover:text-zinc-300" 
                      : "text-zinc-900 hover:text-zinc-600"
                  }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${shouldUseWhiteLogo ? 'bg-white/70' : 'bg-zinc-900/70'} transition-all duration-300 group-hover:w-full`}></span>
                </Link>
              ))}
              <div className={`transition-all duration-300 ${
                shouldUseWhiteLogo 
                  ? "text-white" 
                  : "text-zinc-900"
              }`}>
                <ThreeDotMenu isDark={shouldUseWhiteLogo} />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden z-50 transition-all duration-300 ${
                shouldUseWhiteLogo 
                  ? "text-white hover:text-zinc-200" 
                  : "text-zinc-900 hover:text-zinc-600"
              }`}
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
