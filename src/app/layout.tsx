import type { Metadata } from 'next';
import './globals.css';
import { Toaster as OldToaster } from "@/components/ui/toaster";
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'TyreTrace IA',
  description: 'Solution de Gestion Intelligente pour la Performance des Pneus',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <OldToaster />
        <Toaster />
      </body>
    </html>
  );
}
