"use client"
import { ArrowDown } from "lucide-react"
import { ParticleSystem } from "./ui/particles-simple"

export function HeroSection() {
  const principles = ["Effectuality", "Integrity", "Efficiency", "Coexistence"]

  return (
    <section id="hero" className="relative h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Base gradient background with orange accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#ff6b00]/5" />
        
        {/* Particle system overlay */}
        <ParticleSystem 
          particleCount={80}
          particleSize={2}
          particleColor="#ffffff"
          connectionDistance={120}
          speed={0.4}
          className="w-full h-full"
        />
        
        {/* Subtle dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-5xl">
            <div className="overflow-hidden mb-8">
              <h1 className="text-6xl lg:text-8xl font-light text-white leading-none animate-slide-up">
                Effectuality
                <br />
                <span className="italic font-extralight">Efficiency</span>
                <br />
                <span className="italic font-extralight">Intrigity</span>
                <br />
                <span className="italic font-extralight relative">
                  Co-existance
                  <span className="absolute -bottom-2 left-0 w-32 h-0.5 bg-[#ff6b00] animate-pulse"></span>
                </span>
              
              </h1>
            </div>

            <div className="overflow-hidden mb-12">
              <p className="text-xl lg:text-2xl text-zinc-300 font-light leading-relaxed max-w-3xl animate-slide-up-delay">
                Creating architectural narratives that honor indigenous wisdom while embracing contemporary innovation
                through our core principles.
              </p>
            </div>

            {/* Principles */}
            <div className="overflow-hidden">
              
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator with orange accent */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm uppercase tracking-wider text-[#ff6b00] font-medium">Scroll</span>
          <ArrowDown className="h-6 w-6 text-[#ff6b00]" />
        </div>
      </div>
    </section>
  )
}
