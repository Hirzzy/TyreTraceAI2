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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 pt-[80px] relative overflow-x-hidden">
      <Link href="/" passHref>
        <h1 className="absolute top-5 left-5 text-primary text-3xl md:text-4xl font-extrabold z-10 tracking-wide" style={{ textShadow: '0 0 10px hsla(var(--primary), 0.5)' }}>
          TyreTrace IA
        </h1>
      </Link>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
