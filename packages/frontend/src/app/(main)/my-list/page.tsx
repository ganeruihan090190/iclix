'use client';

import * as React from 'react';
import { useWatchlist } from '@/hooks/use-watchlist';
import { FilmCard } from '@/components/film/film-card';
import type { WatchlistItem } from '@/types';

export default function MyListPage() {
  const { data: watchlist, isLoading } = useWatchlist();

  return (
    <div className="pt-24 px-4 md:px-12 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">My List</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-card/60 animate-pulse rounded-md" />
          ))}
        </div>
      ) : watchlist && watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {watchlist.map((item: WatchlistItem) => (
            <FilmCard key={item.id} film={item.film} aspect="portrait" />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-3">
          <p className="text-xl text-text-secondary">Your list is currently empty.</p>
          <p className="text-sm text-text-muted">
            Explore titles and click the + button to add them here.
          </p>
        </div>
      )}
    </div>
  );
}
