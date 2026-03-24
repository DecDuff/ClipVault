/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [process.env.AWS_S3_PUBLIC_URL?.replace('https://', '') || ''],
  },
  experimental: {
    serverActions: true,
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
