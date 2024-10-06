/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com'], // Add the domain causing the error here
  },
};

export default nextConfig;
