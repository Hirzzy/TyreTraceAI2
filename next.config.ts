
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
  // Add allowedDevOrigins for development to address cross-origin warnings
  allowedDevOrigins: ['https://6000-firebase-studio-1750027131681.cluster-axf5tvtfjjfekvhwxwkkkzsk2y.cloudworkstations.dev']
};

export default nextConfig;
