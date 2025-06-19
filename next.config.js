/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: ['https://studio.firebase.google.com', 'https://6000-firebase-studio-1750027131681.cluster-axf5tvtfjjfekvhwxwkkkzsk2y.cloudworkstations.dev'],
}

module.exports = nextConfig
