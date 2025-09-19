import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'futhouvjmznpkqzyzpfk.supabase.co',
        port: '',
        pathname: '/storage/v1/object/**',
      },
    ],
  },
};

module.exports = nextConfig;


export default nextConfig;
