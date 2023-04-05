/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: false,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
