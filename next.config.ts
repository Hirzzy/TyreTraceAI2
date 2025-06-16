import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // output: 'export', // Supprimé pour permettre le rendu dynamique côté serveur
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    // unoptimized: true, // Supprimé pour réactiver l'optimisation des images par Next.js/App Hosting
  },
};

export default nextConfig;
