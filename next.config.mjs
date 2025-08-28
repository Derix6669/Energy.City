/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Server configuration for listening on all interfaces
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

export default nextConfig
