"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, X, Link } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label: string
  placeholder?: string
  /** When true, uploads file to Supabase via /api/admin/media and uses the returned URL. When false, uses data URL (inline base64). */
  uploadToStorage?: boolean
  /** Folder name in storage (e.g. 'team', 'projects'). Used when uploadToStorage is true. */
  storageFolder?: string
}

export function ImageUpload({
  value,
  onChange,
  label,
  placeholder,
  uploadToStorage = false,
  storageFolder = 'general',
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(value)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setImageUrl(value)
  }, [value])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (15MB limit)
    if (file.size > 15 * 1024 * 1024) {
      setError('File size must be less than 15MB')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      if (uploadToStorage) {
        const formData = new FormData()
        formData.set('file', file)
        formData.set('folder', storageFolder)
        formData.set('altText', label)

        const response = await fetch('/api/admin/media', {
          method: 'POST',
          body: formData,
        })

        const json = await response.json()
        if (!response.ok) {
          setError(json.error || 'Failed to upload image')
          return
        }
        const url = json.data?.file_url
        if (url) {
          setImageUrl(url)
          onChange(url)
        } else {
          setError('Upload succeeded but no URL returned')
        }
      } else {
        const reader = new FileReader()
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string
          setImageUrl(dataUrl)
          onChange(dataUrl)
        }
        reader.readAsDataURL(file)
      }
    } catch (err) {
      console.error('Error uploading file:', err)
      setError('Failed to upload image')
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      onChange(imageUrl.trim())
    }
  }

  const handleRemove = () => {
    setImageUrl('')
    onChange('')
  }

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {value && (
        <div className="relative">
          <img 
            src={value} 
            alt="Preview" 
            className="w-full h-40 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder={placeholder || "https://example.com/image.jpg"}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleUrlSubmit}
            disabled={!imageUrl.trim()}
          >
            <Link className="h-4 w-4 mr-2" />
            Use URL
          </Button>
        </div>

        <div className="text-center">
          <span className="text-sm text-zinc-500">or</span>
        </div>

        <div className="flex items-center justify-center">
          <Label
            htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2 px-4 py-2 border border-dashed border-zinc-300 rounded-lg hover:border-zinc-400 transition-colors">
              <Upload className="h-4 w-4" />
              <span className="text-sm">
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </span>
            </div>
            <Input
              id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </Label>
        </div>
      </div>
    </div>
  )
}