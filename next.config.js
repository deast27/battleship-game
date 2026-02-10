/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: false
  },
  experimental: {
    appDir: '',
  },
}

module.exports = nextConfig
