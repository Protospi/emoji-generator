/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['oaidalleapiprodscus.blob.core.windows.net'],
  },
}

module.exports = nextConfig
