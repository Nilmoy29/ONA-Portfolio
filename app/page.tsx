"use client"

import { useState } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ProjectsSection } from "@/components/projects-section"
import { ExploreSection } from "@/components/explore-section"
import { PartnersSection } from "@/components/partners-section"
import { ContactSection } from "@/components/contact-section"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <div className={`transition-opacity duration-1000 ${isLoading ? "opacity-0" : "opacity-100"}`}>
        <Navigation />
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        <ExploreSection />
        <PartnersSection />
        <ContactSection />

        {/* Footer */}
        <footer className="bg-black text-white py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center mb-4">
                  <img 
                    src="/ona-logo-white.png" 
                    alt="Office of Native Architects" 
                    className="h-8 mr-3"
                  />
                  <span className="text-white font-bold text-lg">| Office of Native Architects</span>
                </div>
                <p className="text-zinc-400 font-light text-sm leading-relaxed">
                  Creating architectural narratives that honor indigenous wisdom while embracing contemporary
                  innovation.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-light mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>
                    <a href="#services" className="hover:text-white transition-colors">
                      Services
                    </a>
                  </li>
                  <li>
                    <a href="#projects" className="hover:text-white transition-colors">
                      Projects
                    </a>
                  </li>
                  <li>
                    <a href="#team" className="hover:text-white transition-colors">
                      Team
                    </a>
                  </li>
                  <li>
                    <a href="#explore" className="hover:text-white transition-colors">
                      ONA Explore
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-light mb-4">Contact Info</h4>
                <div className="space-y-2 text-sm text-zinc-400">
                  <p>info@ona.com.bd</p>
                  <p>+880 1721-115555</p>
                  <p>
                    Asia Park, Dania, Dhaka, Bangladesh
                    <br />
                    Bangladesh
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-zinc-800 pt-8 flex justify-between items-center">
              <p className="text-zinc-400 font-light text-sm">
                © 2024 ONA | Office of Native Architects. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
