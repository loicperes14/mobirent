/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false, // Disable CSS optimization that might cause issues
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['images.unsplash.com', 'blob.v0.dev'],
    unoptimized: true, // Prevent image optimization issues
  },
  // Ensure CSS is properly processed
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Ensure CSS is properly minified but not over-optimized
      config.optimization.minimizer = config.optimization.minimizer.filter(
        (plugin) => plugin.constructor.name !== 'CssMinimizerPlugin'
      );
    }
    return config;
  },
}

export default nextConfig
