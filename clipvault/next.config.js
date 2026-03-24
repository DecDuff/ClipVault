/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [process.env.AWS_S3_PUBLIC_URL?.replace('https://', '') || ''],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
