'use client';

import * as React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FilmModal } from '@/components/film/film-modal';
import { AuthGuard } from '@/components/layout/auth-guard';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-background text-white">
        <Navbar />
        <main className="flex-1 pb-16">{children}</main>
        <FilmModal />
        <Footer />
      </div>
    </AuthGuard>
  );
}
