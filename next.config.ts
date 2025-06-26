import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/selection/type-vehicule',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
