/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: true,
      serverMinification: false,
      serverComponentsExternalPackages: [
        'mongoose',
        "puppeteer-extra",
        "puppeteer-extra-plugin-stealth",
        "puppeteer-extra-plugin-recaptcha",
      ],
    },
    images: {
      domains: ['m.media-amazon.com','rukminim2.flixcart.com']
    }
  }
  
  module.exports = nextConfig