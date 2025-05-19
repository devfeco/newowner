/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [],
  },
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig; 