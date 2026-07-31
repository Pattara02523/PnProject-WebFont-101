import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/regis',
        destination: '/register',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
