'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Play, Info } from 'lucide-react';
import type { Film } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIStore } from '@/stores/ui-store';

interface HeroBannerProps {
  film?: Film | null;
}

export function HeroBanner({ film }: HeroBannerProps) {
  const router = useRouter();
  const openFilmModal = useUIStore((s) => s.openFilmModal);

  if (!film) {
    return (
      <div className="w-full h-[65vh] md:h-[75vh] bg-surface animate-pulse flex items-end p-8 md:p-16">
        <div className="space-y-4 max-w-xl">
          <div className="h-10 bg-card rounded w-3/4" />
          <div className="h-4 bg-card rounded w-full" />
          <div className="h-4 bg-card rounded w-2/3" />
        </div>
      </div>
    );
  }

  const bgImage = film.backdropUrl || film.posterUrl || 'https://picsum.photos/seed/hero/1280/720';

  return (
    <div className="relative w-full h-[65vh] md:h-[80vh] flex items-center">
      {/* Background with Dark Overlays */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl px-4 md:px-12 space-y-4 pt-16">
        {film.type && (
          <span className="text-xs uppercase tracking-widest text-primary font-bold">
            {film.type}
          </span>
        )}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md">
          {film.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-text-secondary">
          <span>{film.releaseYear}</span>
          {film.maturityRating && <Badge variant="rating">{film.maturityRating}</Badge>}
          {film.genres && (
            <span>{film.genres.map((g) => g.name).join(' • ')}</span>
          )}
        </div>

        <p className="text-sm md:text-base text-text-secondary line-clamp-3 max-w-lg drop-shadow">
          {film.description}
        </p>

        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.push(`/watch/${film.id}`)}
            className="font-bold gap-2"
          >
            <Play className="h-5 w-5 fill-black" />
            Play
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => openFilmModal(film)}
            className="bg-card/70 border-white/20 hover:bg-card gap-2 text-white font-semibold"
          >
            <Info className="h-5 w-5" />
            More Info
          </Button>
        </div>
      </div>
    </div>
  );
}
