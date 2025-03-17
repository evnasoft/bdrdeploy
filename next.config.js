/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost', 'bdrspareparts.com', 'www.bdrspareparts.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com'
      },
      {
        protocol: 'https',
        hostname: 'bdrspareparts.com'
      },
      {
        protocol: 'https',
        hostname: 'www.bdrspareparts.com'
      }
    ]
  },
  transpilePackages: ['tailwindcss']
}

module.exports = nextConfig 