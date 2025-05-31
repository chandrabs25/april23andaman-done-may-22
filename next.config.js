// const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare')
// initOpenNextCloudflareForDev()

if (process.env.NODE_ENV === 'development') {
  import('@opennextjs/cloudflare').then(module => {
    if (module && typeof module.initOpenNextCloudflareForDev === 'function') {
      module.initOpenNextCloudflareForDev();
    } else {
      console.warn("initOpenNextCloudflareForDev not found in @opennextjs/cloudflare or is not a function.");
    }
  }).catch(err => {
    console.error("Failed to load @opennextjs/cloudflare for development:", err);
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: false, // Ignore ESLint errors during build
  },
  typescript: {
    ignoreBuildErrors: false, // Ignore TypeScript errors during build
  },
  // Optimize for Cloudflare Pages
  output: 'standalone',
  // Ensure compatibility with Cloudflare Pages
  experimental: {
    // Polyfill Node.js modules for edge runtime
    serverComponentsExternalPackages: ['bcryptjs', 'jose', 'crypto'],
  },
  // Configure image optimization for Cloudflare
  images: {
    domains: ['andamantravel.com', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    // Only disable optimization in production if needed
    unoptimized: true,
  },
  // Add webpack configuration to handle missing modules and DefinePlugin
  webpack: (config, { isServer, nextRuntime, webpack }) => {
    // For edge runtime, provide polyfills or empty modules
    if (nextRuntime === 'edge') {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        bcrypt: false,
        '@node-rs/bcrypt': false,
        '@node-rs/bcrypt-wasm32-wasi': false,
      }
    }

    // Add environment variables
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(
          process.env.NEXT_PUBLIC_API_URL || ''
        ),
        'process.env.SITE_URL': JSON.stringify(
          process.env.SITE_URL || ''
        ),
      })
    )

    return config
  },
  // Environment variables that should be available to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    SITE_URL: process.env.SITE_URL,
  },
}

module.exports = nextConfig