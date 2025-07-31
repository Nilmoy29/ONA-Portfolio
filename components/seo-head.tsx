import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  keywords?: string[]
  noIndex?: boolean
}

export function SEOHead({
  title = "Office of Native Architects - ONA",
  description = "Creating architectural narratives that honor indigenous wisdom while embracing contemporary innovation. Professional architecture services focused on sustainability and cultural heritage.",
  image = "/ona-logo-main.jpg",
  url = "https://ona.com",
  type = "website",
  author,
  publishedTime,
  modifiedTime,
  keywords = [
    "architecture",
    "indigenous design",
    "sustainable architecture",
    "native architects",
    "cultural architecture",
    "architectural services",
    "design philosophy",
    "environmental design"
  ],
  noIndex = false
}: SEOHeadProps) {
  const fullTitle = title.includes("ONA") ? title : `${title} | Office of Native Architects`
  const imageUrl = image.startsWith('http') ? image : `${url}${image}`
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      {author && <meta name="author" content={author} />}
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Office of Native Architects" />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@ona_architects" />
      <meta name="twitter:creator" content="@ona_architects" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Office of Native Architects",
            "alternateName": "ONA",
            "url": "https://ona.com",
            "logo": `${url}/ona-logo-main.jpg`,
            "description": description,
            "foundingDate": "2015",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "123 Architecture Street",
              "addressLocality": "Design City",
              "addressRegion": "DC",
              "postalCode": "12345",
              "addressCountry": "US"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-555-123-4567",
              "contactType": "customer service",
              "email": "info@ona.com"
            },
            "sameAs": [
              "https://linkedin.com/company/ona",
              "https://instagram.com/ona_architects",
              "https://twitter.com/ona_architects"
            ],
            "serviceArea": {
              "@type": "Country",
              "name": "United States"
            },
            "areaServed": "United States",
            "knowsAbout": [
              "Architecture",
              "Indigenous Design",
              "Sustainable Architecture",
              "Cultural Heritage",
              "Environmental Design"
            ]
          })
        }}
      />
    </Head>
  )
} 