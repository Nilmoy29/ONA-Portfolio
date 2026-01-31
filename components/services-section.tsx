"use client"

import { motion } from "framer-motion"
import { Building2, Palette, Trees, Lightbulb, Hammer, BarChart3, Map, Brush, Settings, Home, Leaf, Sun, Mountain, Compass, TreePine, Waves, Wind } from "lucide-react"
import Image from "next/image"

// Icon mapping for services
const iconMap = {
  building: Building2,
  palette: Palette,
  trees: Trees,
  lightbulb: Lightbulb,
  hammer: Hammer,
  barchart: BarChart3,
  map: Map,
  brush: Brush,
  settings: Settings,
  home: Home,
  leaf: Leaf,
  sun: Sun,
  mountain: Mountain,
  compass: Compass,
  treepine: TreePine,
  waves: Waves,
  wind: Wind,
}

// Hardcoded services data
const servicesData = [
  {
    id: 1,
    title: "Architectural Design",
    description: "Transform your vision into reality with comprehensive design solutions that honor cultural heritage while embracing contemporary innovation. From concept to completion, we create spaces that resonate with meaning.",
    icon: Home,
    features: [
      { icon: Home, title: "Custom Exterior Solution", description: "Tailored design approaches for unique projects" },
      { icon: Compass, title: "Interior Solution", description: "Respecting cultural traditions in modern architecture" },
      { icon: TreePine, title: "Landscape Design", description: "Sustainable and environmentally conscious design" }
    ],
    images: [
      "/interior-design.jpg",
      "/interior-design2.jpg"
    ]
  },
  {
    id: 2,
    title: "Engineering Consultancy",
    description: "Delivering smart engineering solutions that respect the past while embracing the future. Our consultancy ensures structural integrity, modern systems integration, and precise calculations tailored to heritage and contemporary architecture alike.",
    icon: Mountain,
    features: [
      { icon: Mountain, title: "Structural Solution", description: "Robust and context-sensitive structural designs." },
      { icon: Settings, title: "Electrical Solution", description: "Seamless integration of modern electrical systems" },
      { icon: Brush, title: "Feasibility Calculation", description: "Accurate modeling to ensure structural performance." }
    ],
    images: [
      "/Heritage.jpg",
      "/Heritage2.jpg"
    ]
  },
  {
    id: 3,
    title: "Community Planning",
    description: "Create thriving communities through strategic planning that balances growth with cultural preservation. Our approach ensures sustainable development that serves both present and future generations.",
    icon: Map,
    features: [
      { icon: Map, title: "Regional Planning", description: "Strategic development for sustainable communities" },
      { icon: Trees, title: "Adaptive Reuse", description: "Landscape design that connects built and natural environments" },
      { icon: Wind, title: "Climate Responsive", description: "Designs adapted to local environmental conditions" }
    ],
    images: [
      "/Community.jpg",
      "/Community2.jpg"
    ]
  }
]

export function ServicesSection() {
  // Use hardcoded services data - no Supabase fetching
  const services = servicesData

  return (
    <section id="services" className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.h2 
          className="text-4xl sm:text-5xl lg:text-7xl font-light leading-tight tracking-tight mb-12 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          OUR <span className="text-gray-500">SERVICES</span>
        </motion.h2>

        <div className="space-y-12">
          {services.map((service, index) => {
            const isEven = index % 2 === 0
            const Icon = service.icon

            return (
              <motion.div
                key={service.id}
                className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                                 {/* Content Side */}
                <div className={`lg:col-span-5 ${!isEven ? 'order-2 lg:order-2' : ''}`}>
                  <div className="lg:sticky lg:top-8">
                    <h3 className="text-sm uppercase tracking-widest text-gray-400 font-medium mb-4 flex items-center gap-2">
                      <span className="w-8 h-px bg-gray-500"></span>
                      Service {String(index + 1).padStart(2, '0')}
                    </h3>
                    
                    <h4 className="text-4xl lg:text-5xl font-bold mb-6 text-white transition-all duration-500 leading-tight group-hover:text-transparent group-hover:[-webkit-text-stroke:1px_white]">
                      {service.title}
                    </h4>
                    
                    <p className="text-gray-400 leading-relaxed mb-8 text-xl font-light">
                      {service.description}
                    </p>
                    
                    <div className="space-y-4 mb-8">
                      {service.features.map((feature, featureIndex) => {
                        const FeatureIcon = feature.icon
                        return (
                          <div key={featureIndex} className="flex items-start gap-3">
                            <FeatureIcon className="w-5 h-5 stroke-[1.5] text-gray-400 mt-0.5" />
                            <div>
                              <h5 className="font-medium mb-1 text-white">{feature.title}</h5>
                              <p className="text-sm text-gray-500">{feature.description}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    

                  </div>
                </div>

                {/* Images Side */}
                <div className={`lg:col-span-7 ${!isEven ? 'order-1 lg:order-1' : ''}`}>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {service.images.map((image, imageIndex) => (
                                             <motion.div
                         key={imageIndex}
                         className={`relative overflow-hidden rounded-2xl ${imageIndex === 1 ? 'sm:mt-8' : ''} bg-white p-1`}
                         whileHover={{ scale: 1.05 }}
                         transition={{ duration: 0.7 }}
                       >
                         <div className="w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
                           <Image
                             src={image}
                             alt={`${service.title} - Image ${imageIndex + 1}`}
                             width={600}
                             height={400}
                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                           />
                         </div>
                       </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
