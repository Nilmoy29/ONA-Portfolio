"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Leaf, 
  Recycle, 
  Sun, 
  Droplets,
  Wind,
  TreePine,
  Target,
  Award,
  Users,
  Building
} from 'lucide-react'

const sustainabilityPrinciples = [
  {
    icon: Leaf,
    title: 'Indigenous Knowledge Integration',
    description: 'Incorporating traditional ecological knowledge and sustainable practices passed down through generations.'
  },
  {
    icon: Recycle,
    title: 'Circular Design Principles',
    description: 'Designing for longevity, adaptability, and end-of-life material recovery to minimize waste.'
  },
  {
    icon: Sun,
    title: 'Renewable Energy Systems',
    description: 'Integrating solar, wind, and other renewable energy sources to achieve net-zero energy buildings.'
  },
  {
    icon: Droplets,
    title: 'Water Conservation',
    description: 'Implementing rainwater harvesting, greywater recycling, and drought-resistant landscaping.'
  },
  {
    icon: Wind,
    title: 'Natural Ventilation',
    description: 'Designing buildings that work with natural air currents to reduce mechanical cooling needs.'
  },
  {
    icon: TreePine,
    title: 'Biodiversity Enhancement',
    description: 'Creating buildings and landscapes that support local ecosystems and native species.'
  }
]

const commitments = [
  {
    title: 'Carbon Neutral by 2030',
    description: 'All ONA projects will achieve net-zero carbon emissions through design and operation.',
    progress: 65,
    target: '2030'
  },
  {
    title: '100% Renewable Energy',
    description: 'Transitioning all projects to renewable energy sources for operations.',
    progress: 78,
    target: '2028'
  },
  {
    title: 'Zero Waste to Landfill',
    description: 'Implementing circular design principles to eliminate construction waste.',
    progress: 42,
    target: '2032'
  },
  {
    title: 'Native Plant Integration',
    description: 'Using 90% native plants in all landscape design projects.',
    progress: 88,
    target: '2025'
  }
]

const certifications = [
  {
    name: 'LEED Platinum',
    description: 'Leadership in Energy and Environmental Design',
    count: 12
  },
  {
    name: 'Living Building Challenge',
    description: 'Most rigorous green building standard',
    count: 3
  },
  {
    name: 'BREEAM Outstanding',
    description: 'Building Research Establishment Environmental Assessment Method',
    count: 8
  },
  {
    name: 'Passive House',
    description: 'Ultra-low energy building standard',
    count: 5
  }
]

const stats = [
  {
    icon: Building,
    value: '95%',
    label: 'Projects meet or exceed green building standards'
  },
  {
    icon: Leaf,
    value: '40%',
    label: 'Average reduction in carbon footprint'
  },
  {
    icon: Droplets,
    value: '60%',
    label: 'Water usage reduction through conservation'
  },
  {
    icon: Users,
    value: '15+',
    label: 'Community partnerships for sustainability'
  }
]

export default function SustainabilityPage() {
  const [activeTab, setActiveTab] = useState('principles')

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-zinc-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-light text-zinc-900 mb-6">
              Sustainability
            </h1>
            <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
              Our commitment to environmental stewardship through indigenous wisdom, 
              innovative design, and community partnership.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
          <div className="text-center text-white z-20">
            <h2 className="text-3xl font-light mb-4">Building for Future Generations</h2>
            <p className="text-lg opacity-90">Where tradition meets innovation</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-zinc-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-light text-zinc-900 mb-2">{stat.value}</div>
                <div className="text-sm text-zinc-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {[
            { id: 'principles', label: 'Our Principles' },
            { id: 'commitments', label: 'Commitments' },
            { id: 'certifications', label: 'Certifications' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Principles Tab */}
        {activeTab === 'principles' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-light text-zinc-900 mb-6">
                Our Sustainability Principles
              </h2>
              <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
                Our approach to sustainability is rooted in indigenous wisdom and contemporary 
                innovation, creating buildings that heal rather than harm our environment.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sustainabilityPrinciples.map((principle, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <principle.icon className="w-8 h-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">{principle.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-600 leading-relaxed">{principle.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Commitments Tab */}
        {activeTab === 'commitments' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-light text-zinc-900 mb-6">
                Our Sustainability Commitments
              </h2>
              <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
                We've set ambitious targets to ensure our work contributes to a sustainable future. 
                Track our progress toward these goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {commitments.map((commitment, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <CardTitle className="text-xl">{commitment.title}</CardTitle>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        <Target className="w-3 h-3 mr-1" />
                        {commitment.target}
                      </Badge>
                    </div>
                    <p className="text-zinc-600">{commitment.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{commitment.progress}%</span>
                      </div>
                      <Progress value={commitment.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Tab */}
        {activeTab === 'certifications' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-light text-zinc-900 mb-6">
                Certifications & Recognition
              </h2>
              <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
                Our commitment to sustainability is validated through leading industry 
                certifications and recognition programs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {certifications.map((cert, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{cert.name}</CardTitle>
                        <p className="text-zinc-600">{cert.description}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
                        {cert.count}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-8 text-center">
                <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-light text-zinc-900 mb-4">
                  28 Total Certifications
                </h3>
                <p className="text-zinc-600 max-w-2xl mx-auto">
                  Our portfolio includes 28 certified sustainable building projects, 
                  representing our unwavering commitment to environmental excellence 
                  and community well-being.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-zinc-900 text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-light mb-4">
            Partner with Us for Sustainable Design
          </h3>
          <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
            Ready to create a project that honors the environment and serves your community? 
            Let's work together to build a sustainable future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-zinc-900 px-6 py-3 rounded-lg font-medium hover:bg-zinc-100 transition-colors">
              Start Your Project
            </button>
            <button className="border border-zinc-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}