/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: true,
  },
  // Configure Turbopack to avoid webpack config conflicts
  turbopack: {},
  webpack: (config, { isServer }) => {
    // Fix for chunk loading errors
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    return config
  },
}

export default nextConfig
