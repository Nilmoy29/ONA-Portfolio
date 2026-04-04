"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Download, Share2, ZoomIn, ZoomOut } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface ProjectGalleryModalProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  initialIndex?: number
  projectTitle?: string
}

export function ProjectGalleryModal({ 
  isOpen, 
  onClose, 
  images, 
  initialIndex = 0,
  projectTitle = "Project Gallery"
}: ProjectGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isZoomed, setIsZoomed] = useState(false)
  const [showThumbnails, setShowThumbnails] = useState(true)

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex, isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
        case ' ':
          e.preventDefault()
          setIsZoomed(!isZoomed)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isZoomed])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: projectTitle,
          text: `Check out this image from ${projectTitle}`,
          url: images[currentIndex],
        })
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(images[currentIndex])
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = images[currentIndex]
    link.download = `${projectTitle.replace(/\s+/g, '-').toLowerCase()}-${currentIndex + 1}.jpg`
    link.click()
  }

  if (!isOpen || images.length === 0) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6"
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h3 className="text-lg font-medium">{projectTitle}</h3>
              <p className="text-sm text-zinc-300">
                {currentIndex + 1} of {images.length}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsZoomed(!isZoomed)}
                className="text-white hover:bg-white/20"
              >
                {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-white hover:bg-white/20"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Image */}
        <div className="flex items-center justify-center h-full p-4 pt-20 pb-24">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: isZoomed ? 1.5 : 1,
              transition: { duration: 0.3 }
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-full max-h-full"
            style={{
              cursor: isZoomed ? 'zoom-out' : 'zoom-in'
            }}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <Image
              src={images[currentIndex]}
              alt={`${projectTitle} - Image ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
              priority
            />
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Thumbnails */}
        {images.length > 1 && showThumbnails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6"
          >
            <div className="flex items-center justify-center space-x-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? 'border-white scale-110'
                      : 'border-transparent hover:border-white/50'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
            
            <div className="flex justify-center mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowThumbnails(false)}
                className="text-white hover:bg-white/20 text-xs"
              >
                Hide Thumbnails
              </Button>
            </div>
          </motion.div>
        )}

        {/* Show thumbnails button when hidden */}
        {images.length > 1 && !showThumbnails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowThumbnails(true)}
              className="text-white bg-black/50 hover:bg-black/70 text-xs"
            >
              Show Thumbnails
            </Button>
          </motion.div>
        )}

        {/* Progress Bar */}
        {images.length > 1 && (
          <div className="absolute top-20 left-0 right-0 h-1 bg-white/20">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ 
                width: `${((currentIndex + 1) / images.length) * 100}%`
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        {/* Keyboard shortcuts hint */}
        <div className="absolute bottom-6 right-6 text-white/60 text-xs">
          <div>← → Navigate</div>
          <div>Space Toggle zoom</div>
          <div>Esc Close</div>
        </div>
      </div>
    </AnimatePresence>
  )
} 