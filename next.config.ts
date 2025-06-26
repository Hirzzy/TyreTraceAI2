import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // La redirection a été supprimée car elle causait une erreur 404 sur Vercel.
  // La redirection est maintenant gérée côté client dans src/app/page.tsx.
  devIndicators: {
    allowedDevOrigins: [
      "https://*.cloudworkstations.dev",
    ],
  },
};

export default nextConfig;
