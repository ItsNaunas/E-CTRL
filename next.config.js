/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove any basePath to ensure clean URLs
  basePath: '',
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
