'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = React.useState('user@iclix.com');
  const [password, setPassword] = React.useState('user123');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      await login(email, password);
    } catch {
      // handled by useAuth
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black/60 px-4">
      {/* Background Image with Netflix-style gradient */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2069&auto=format&fit=crop")',
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-black/50 to-background" />

      {/* Header Logo */}
      <header className="absolute top-0 left-0 p-6 md:px-12">
        <Link href="/browse" className="text-3xl md:text-4xl font-black text-primary tracking-wider">
          ICLIX
        </Link>
      </header>

      {/* Card Form */}
      <div className="w-full max-w-md bg-black/75 p-8 md:p-12 rounded-lg border border-border shadow-2xl backdrop-blur-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Sign In</h1>

        {error && (
          <div className="p-3 mb-4 rounded bg-primary/20 border border-primary text-primary text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-text-secondary block mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@iclix.com or user@iclix.com"
              required
            />
          </div>

          <div>
            <label className="text-xs text-text-secondary block mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full mt-4 font-bold tracking-wide"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          <div className="flex items-center justify-between text-xs text-text-muted pt-2">
            <span className="hover:underline cursor-pointer">Need help?</span>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@iclix.com');
                setPassword('admin123');
              }}
              className="text-text-secondary hover:text-white"
            >
              Fill Admin Demo
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-800 text-sm text-text-secondary">
          New to ICLIX?{' '}
          <Link href="/register" className="text-white hover:underline font-semibold">
            Sign up now.
          </Link>
        </div>
      </div>
    </div>
  );
}
