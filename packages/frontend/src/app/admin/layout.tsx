'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Film, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, isAdmin } = useAuthStore();
  const [authorized, setAuthorized] = React.useState(false);

  React.useEffect(() => {
    if (!token || !user) {
      router.push('/login');
      return;
    }
    if (!isAdmin()) {
      router.push('/browse');
      return;
    }
    setAuthorized(true);
  }, [user, token, isAdmin, router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Film Management', href: '/admin/films', icon: Film },
  ];

  return (
    <div className="min-h-screen flex bg-background text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface flex flex-col justify-between p-4 hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <span className="text-2xl font-black text-primary tracking-wider">ICLIX</span>
            <span className="text-[10px] bg-primary/20 text-primary border border-primary/40 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
              Admin
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-white font-semibold shadow'
                      : 'text-text-secondary hover:bg-card hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-border pt-4">
          <Link
            href="/browse"
            className="flex items-center gap-2 text-xs text-text-muted hover:text-white transition-colors px-3 py-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-surface">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-primary">ICLIX</span>
            <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold">
              ADMIN
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Link href="/admin" className="text-text-secondary hover:text-white">
              Dashboard
            </Link>
            <Link href="/admin/films" className="text-text-secondary hover:text-white">
              Films
            </Link>
            <Link href="/browse" className="text-primary font-bold">
              Exit
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
