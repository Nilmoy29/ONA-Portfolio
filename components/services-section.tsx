"use client"

import { motion } from "framer-motion"
import { Building2, Palette, Trees, Lightbulb, Hammer, BarChart3, Map, Brush, Settings, Home, Leaf, Sun, Mountain, Compass, TreePine, Waves, Wind } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ServiceImageEntry {
  src: string
  projectHref: string
}

interface ServiceCollageProps {
  images: ServiceImageEntry[]
  serviceTitle: string
  /** When true, collage is mirrored for image column on the left */
  mirrored: boolean
}

function ServiceImageCollage({ images, serviceTitle, mirrored }: ServiceCollageProps) {
  const [primary, secondary] = images
  if (!primary) return null

  const shadowBase = "pointer-events-none absolute rounded-2xl bg-zinc-800/90 -z-10"
  const frameClass =
    "relative z-0 block overflow-hidden rounded-2xl ring-1 ring-white/10 bg-zinc-900 shadow-2xl"

  return (
    <div
      className={`relative mx-auto w-full max-w-xl lg:max-w-none min-h-[min(72vw,340px)] sm:min-h-[380px] lg:min-h-[460px] ${
        mirrored ? "lg:pr-4" : "lg:pl-4"
      }`}
    >
      {primary && (
        <Link href={primary.projectHref} className="group/primary block">
          <motion.div
            className={`relative w-[min(100%,280px)] sm:w-[72%] lg:w-[68%] ${mirrored ? "ml-auto" : "mr-auto"}`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className={`${shadowBase} inset-0 ${mirrored ? "-translate-x-3 translate-y-3" : "translate-x-3 translate-y-3"}`}
              aria-hidden
            />
            <div className={`${frameClass} aspect-[3/4]`}>
              <Image
                src={primary.src}
                alt={`${serviceTitle} — featured`}
                width={600}
                height={800}
                className="h-full w-full object-cover transition-transform duration-700 group-hover/primary:scale-105"
              />
            </div>
          </motion.div>
        </Link>
      )}

      {secondary && (
        <Link href={secondary.projectHref} className="group/secondary block">
          <motion.div
            className={`absolute z-10 w-[min(100%,240px)] sm:w-[58%] max-w-md bottom-[4%] ${
              mirrored ? "left-0 sm:left-[2%]" : "right-0 sm:right-[2%]"
            }`}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className={`${shadowBase} inset-0 rounded-xl ${mirrored ? "-translate-x-2 translate-y-2" : "translate-x-2 translate-y-2"}`}
              aria-hidden
            />
            <div className={`${frameClass} aspect-[5/4] rounded-xl`}>
              <Image
                src={secondary.src}
                alt={`${serviceTitle} — detail`}
                width={640}
                height={512}
                className="h-full w-full object-cover transition-transform duration-700 group-hover/secondary:scale-105"
              />
            </div>
          </motion.div>
        </Link>
      )}
    </div>
  )
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
      { src: "/Exterior.jpg", projectHref: "/projects/jahir-residence" },
      { src: "/Interior.jpg", projectHref: "/projects/অবসরি" }
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
      { src: "/Chand.jpeg", projectHref: "/projects/chand-masjid" },
      { src: "/Heritage2.jpg", projectHref: "/projects/chitro-niloy" }
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
      { src: "/Community.jpg", projectHref: "/projects/kolonto" },
      { src: "/sohochor.jpg", projectHref: "/projects/সহচর" }
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

                {/* Images Side — overlapping collage + offset shadow layers */}
                <div className={`lg:col-span-7 ${!isEven ? "order-1 lg:order-1" : ""}`}>
                  <ServiceImageCollage
                    images={service.images}
                    serviceTitle={service.title}
                    mirrored={!isEven}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
