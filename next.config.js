/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: 'build/app',
  output: 'export',
  basePath: '/app',
  assetPrefix: '/app/'
};

module.exports = nextConfig;

