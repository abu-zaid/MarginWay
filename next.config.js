/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: true,
      serverMinification: false,
      serverComponentsExternalPackages: ['mongoose']
    },
    images: {
      domains: ['m.media-amazon.com','rukminim2.flixcart.com']
    }
  }
  
  module.exports = nextConfig