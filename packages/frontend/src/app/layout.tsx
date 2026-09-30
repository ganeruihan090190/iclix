import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { ToastContainer } from '@/components/ui/toast';

export const metadata: Metadata = {
  title: 'ICLIX — Stream Anything',
  description: 'Netflix-style streaming platform built with Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-white font-sans antialiased min-h-screen">
        <QueryProvider>
          {children}
          <ToastContainer />
        </QueryProvider>
      </body>
    </html>
  );
}
