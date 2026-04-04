"use client"

import { useEffect, useRef, useCallback } from 'react'

interface ParticleSystemProps {
  particleCount?: number
  particleSize?: number
  particleColor?: string
  connectionDistance?: number
  speed?: number
  className?: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

export function ParticleSystem({
  particleCount = 80,
  particleSize = 2,
  particleColor = '#ffffff',
  connectionDistance = 120,
  speed = 0.5,
  className = ''
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size: Math.random() * particleSize + 1
    }
  }, [speed, particleSize])

  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    particlesRef.current = []
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle(canvas))
    }
  }, [particleCount, createParticle])

  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fillStyle = particleColor
    ctx.fill()
    
    // Add glow effect
    ctx.shadowBlur = 10
    ctx.shadowColor = particleColor
    ctx.fill()
    ctx.shadowBlur = 0
  }, [particleColor])

  const drawConnection = useCallback((
    ctx: CanvasRenderingContext2D,
    particle1: Particle,
    particle2: Particle,
    distance: number
  ) => {
    const opacity = 1 - (distance / connectionDistance)
    const hex = particleColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.3})`
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(particle1.x, particle1.y)
    ctx.lineTo(particle2.x, particle2.y)
    ctx.stroke()
  }, [particleColor, connectionDistance])

  const updateParticle = useCallback((particle: Particle, canvas: HTMLCanvasElement) => {
    particle.x += particle.vx
    particle.y += particle.vy

    // Bounce off edges
    if (particle.x < 0 || particle.x > canvas.width) {
      particle.vx = -particle.vx
    }
    if (particle.y < 0 || particle.y > canvas.height) {
      particle.vy = -particle.vy
    }

    // Keep particles within bounds
    particle.x = Math.max(0, Math.min(canvas.width, particle.x))
    particle.y = Math.max(0, Math.min(canvas.height, particle.y))

    // Mouse interaction
    const mouse = mouseRef.current
    const dx = mouse.x - particle.x
    const dy = mouse.y - particle.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance < 100) {
      const force = (100 - distance) / 100
      particle.vx += (dx / distance) * force * 0.01
      particle.vy += (dy / distance) * force * 0.01
    }

    // Apply friction
    particle.vx *= 0.99
    particle.vy *= 0.99

    // Minimum velocity
    if (Math.abs(particle.vx) < 0.1) particle.vx = (Math.random() - 0.5) * speed
    if (Math.abs(particle.vy) < 0.1) particle.vy = (Math.random() - 0.5) * speed
  }, [speed])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const particles = particlesRef.current

    // Update and draw particles
    particles.forEach(particle => {
      updateParticle(particle, canvas)
      drawParticle(ctx, particle)
    })

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < connectionDistance) {
          drawConnection(ctx, particles[i], particles[j], distance)
        }
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [updateParticle, drawParticle, drawConnection, connectionDistance])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }, [])

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const { width, height } = container.getBoundingClientRect()
    if (width > 0 && height > 0) {
      canvas.width = width
      canvas.height = height
      
      // Reinitialize particles with new canvas size
      initParticles(canvas)
    }
  }, [initParticles])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    // Initial setup with a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      handleResize()
      animate()
    }, 100)

    // Add event listeners
    canvas.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timer)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      canvas.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [animate, handleMouseMove, handleResize])

  return (
    <div ref={containerRef} className={`w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  )
}