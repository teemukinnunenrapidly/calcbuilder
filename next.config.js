/** @type {import('next').NextConfig} */
const nextConfig = {
  // React strict mode
  reactStrictMode: true,

  // Swc minification
  swcMinify: true,

  // Vercel optimizations
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // Image optimization
  images: {
    domains: [
      'localhost',
      'calcbuilder.com',
      'calcbuilder.local',
      'images.unsplash.com',
      'via.placeholder.com',
    ],
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Powered by header
  poweredByHeader: false,
};

module.exports = nextConfig;
