/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove any basePath to ensure clean URLs
  basePath: '',
  images: {
    formats: ['image/webp', 'image/avif'],
    // Disable lazy loading for development to prevent intervention warnings
    ...(process.env.NODE_ENV === 'development' && {
      unoptimized: true,
    }),
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
