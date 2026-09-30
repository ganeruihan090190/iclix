'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, ChevronDown, User, LogOut, ShieldAlert, Settings } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);

  const { user, selectedProfile, logout, isAdmin } = useAuthStore();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', href: '/browse' },
    { label: 'Series', href: '/browse?type=series' },
    { label: 'Films', href: '/browse?type=movie' },
    { label: 'New & Popular', href: '/browse?sort=new' },
    { label: 'My List', href: '/my-list' },
    { label: 'History', href: '/history' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-colors duration-300 px-4 md:px-12 py-3 flex items-center justify-between',
        isScrolled ? 'bg-background shadow-md' : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      )}
    >
      <div className="flex items-center gap-8">
        <Link href="/browse" className="text-primary font-black tracking-wider text-2xl md:text-3xl font-sans">
          ICLIX
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-white',
                  isActive ? 'text-white font-semibold' : 'text-text-secondary'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4 text-white">
        {/* Search Bar */}
        <div className="relative flex items-center">
          {isSearchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Titles, people, genres..."
                autoFocus
                className="w-44 md:w-64 bg-black/70 border border-white/50 text-white text-xs px-8 py-1.5 rounded focus:outline-none focus:border-white transition-all"
                onBlur={() => {
                  if (!searchQuery) setIsSearchOpen(false);
                }}
              />
              <Search className="h-4 w-4 absolute left-2 text-text-secondary pointer-events-none" />
            </form>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1 hover:text-text-secondary transition-colors"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Notifications (Mock) */}
        <button className="p-1 hover:text-text-secondary transition-colors" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </button>

        {/* Profile Avatar / Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-1.5 group p-1 focus:outline-none"
          >
            <div className="w-8 h-8 rounded bg-primary/80 flex items-center justify-center font-bold text-xs uppercase overflow-hidden border border-white/20">
              {selectedProfile?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedProfile.avatarUrl}
                  alt={selectedProfile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                selectedProfile?.name?.[0] || user?.email?.[0] || 'U'
              )}
            </div>
            <ChevronDown className="h-3 w-3 text-text-secondary group-hover:text-white transition-transform duration-200" />
          </button>

          {isProfileMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded shadow-xl py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setIsProfileMenuOpen(false)}
            >
              <div className="px-4 py-2 border-b border-border">
                <p className="font-semibold text-white truncate">{selectedProfile?.name || 'User'}</p>
                <p className="text-xs text-text-muted truncate">{user?.email}</p>
              </div>

              <Link
                href="/profile-select"
                onClick={() => setIsProfileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:bg-card hover:text-white transition-colors"
              >
                <User className="h-4 w-4" />
                Switch Profile
              </Link>

              <Link
                href="/profile"
                onClick={() => setIsProfileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:bg-card hover:text-white transition-colors"
              >
                <Settings className="h-4 w-4" />
                Manage Profiles
              </Link>

              {isAdmin() && (
                <Link
                  href="/admin"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-card transition-colors font-medium"
                >
                  <ShieldAlert className="h-4 w-4" />
                  Admin Panel
                </Link>
              )}

              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  logout();
                  router.push('/login');
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-text-secondary hover:bg-card hover:text-white transition-colors border-t border-border mt-1"
              >
                <LogOut className="h-4 w-4" />
                Sign out of ICLIX
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
