// src/app/(selection)/layout.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'TyreTrace IA - Sélection',
  description: 'Processus de sélection et de nouvelle inspection TyreTrace IA.',
};

export default function SelectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 relative">
      {/* The main content will control its own padding and layout now */}
      {children}
    </div>
  );
}
