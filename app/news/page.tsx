"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Search, 
  Calendar, 
  ArrowRight,
  Filter,
  Clock
} from 'lucide-react'

interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image_url: string | null
  category: string
  author: string
  author_image?: string
  published_date: string
  read_time: number
}

const categories = ['All', 'Design Philosophy', 'Awards', 'Partnerships', 'Sustainability', 'Projects']

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchArticles()
  }, [searchTerm, selectedCategory, sortBy])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (searchTerm) params.append('search', searchTerm)
      
      const response = await fetch(`/api/public/news?${params.toString()}`)
      const data = await response.json()
      
      let filteredArticles = data.data || []

      // Apply category filter (client-side for now)
      if (selectedCategory !== 'All') {
        filteredArticles = filteredArticles.filter((article: NewsArticle) => 
          article.category === selectedCategory
        )
      }

      // Apply sorting (client-side)
      filteredArticles.sort((a: NewsArticle, b: NewsArticle) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.published_date).getTime() - new Date(a.published_date).getTime()
          case 'oldest':
            return new Date(a.published_date).getTime() - new Date(b.published_date).getTime()
          case 'alphabetical':
            return a.title.localeCompare(b.title)
          default:
            return 0
        }
      })

      setArticles(filteredArticles)
    } catch (error) {
      console.error('Error fetching articles:', error)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Design Philosophy': return 'bg-purple-100 text-purple-800'
      case 'Awards': return 'bg-yellow-100 text-yellow-800'
      case 'Partnerships': return 'bg-blue-100 text-blue-800'
      case 'Sustainability': return 'bg-green-100 text-green-800'
      case 'Projects': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-zinc-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-light text-zinc-900 mb-6">
              News & Insights
            </h1>
            <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
              Stay updated with our latest projects, insights, and thoughts on 
              architecture, sustainability, and indigenous design principles.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-zinc-600">
            {loading ? 'Loading...' : `${articles.length} article${articles.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-zinc-200 aspect-[16/10] rounded-lg mb-4"></div>
                <div className="h-4 bg-zinc-200 rounded mb-2"></div>
                <div className="h-3 bg-zinc-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-zinc-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-zinc-500 text-lg">No articles found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('All')
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            {/* Featured Article (First Article) */}
            {articles.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-light text-zinc-900 mb-6">Featured Article</h2>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative aspect-[16/10] lg:aspect-auto">
                      {articles[0].featured_image_url ? (
                        <Image
                          src={articles[0].featured_image_url}
                          alt={articles[0].title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                          <span className="text-zinc-400">No Image</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className={getCategoryColor(articles[0].category)}>
                          {articles[0].category}
                        </Badge>
                        <span className="text-sm text-zinc-500">•</span>
                        <div className="flex items-center text-sm text-zinc-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {articles[0].read_time} min read
                        </div>
                      </div>
                      <h3 className="text-2xl font-medium text-zinc-900 mb-4">
                        {articles[0].title}
                      </h3>
                      <p className="text-zinc-600 mb-6 leading-relaxed">
                        {articles[0].excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-zinc-500">
                          <span>By {articles[0].author}</span>
                          <span className="mx-2">•</span>
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{new Date(articles[0].published_date).toLocaleDateString()}</span>
                        </div>
                        <Button variant="ghost" asChild>
                          <Link href={`/news/${articles[0].slug}`}>
                            Read More
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>
            )}

            {/* Other Articles */}
            {articles.length > 1 && (
              <div>
                <h2 className="text-2xl font-light text-zinc-900 mb-6">More Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.slice(1).map((article) => (
                    <Card key={article.id} className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {article.featured_image_url ? (
                          <Image
                            src={article.featured_image_url}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                            <span className="text-zinc-400">No Image</span>
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <Badge className={getCategoryColor(article.category)}>
                            {article.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3 text-sm text-zinc-500">
                          <Clock className="w-4 h-4" />
                          <span>{article.read_time} min read</span>
                          <span>•</span>
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(article.published_date).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-lg font-medium text-zinc-900 mb-3 group-hover:text-zinc-700 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-zinc-600 text-sm mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-500">By {article.author}</span>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/news/${article.slug}`}>
                              Read More
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-zinc-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-light text-zinc-900 mb-4">
            Stay Updated
          </h3>
          <p className="text-zinc-600 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest news, insights, and updates 
            from the Office of Native Architects directly in your inbox.
          </p>
          <form onSubmit={async (e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const email = formData.get('email') as string
            
            try {
              const response = await fetch('/api/public/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
              })
              
              if (response.ok) {
                e.currentTarget.reset()
                alert('Successfully subscribed!')
              } else {
                const data = await response.json()
                alert(data.error || 'Failed to subscribe')
              }
            } catch (error) {
              alert('Failed to subscribe. Please try again.')
            }
          }} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input type="email" name="email" placeholder="Enter your email" className="flex-1" required />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </div>
    </div>
  )
}