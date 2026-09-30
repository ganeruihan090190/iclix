'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Play, Plus, Check, Info } from 'lucide-react';
import type { Film } from '@/types';
import { useUIStore } from '@/stores/ui-store';
import { useWatchlist, useWatchlistMutations } from '@/hooks/use-watchlist';
import { formatDuration } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface FilmCardProps {
  film: Film;
  aspect?: 'portrait' | 'landscape';
}

export function FilmCard({ film, aspect = 'portrait' }: FilmCardProps) {
  const router = useRouter();
  const openFilmModal = useUIStore((s) => s.openFilmModal);
  const { data: watchlist } = useWatchlist();
  const { add, remove } = useWatchlistMutations(film.id);

  const isWatchlisted = Boolean(
    watchlist?.some((item: { film: { id: string } }) => item.film.id === film.id)
  );

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWatchlisted) {
      remove.mutate();
    } else {
      add.mutate();
    }
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/watch/${film.id}`);
  };

  const handleCardClick = () => {
    openFilmModal(film);
  };

  const imageSrc = aspect === 'landscape' && film.backdropUrl
    ? film.backdropUrl
    : film.posterUrl || 'https://picsum.photos/seed/' + film.id + '/400/600';

  return (
    <div
      onClick={handleCardClick}
      className="group relative rounded-md overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-2xl bg-card border border-transparent hover:border-white/20 flex-shrink-0"
    >
      <div
        className={aspect === 'portrait' ? 'w-36 sm:w-44 md:w-52 aspect-[2/3]' : 'w-56 sm:w-64 md:w-72 aspect-[16/9]'}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={film.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Hover Info Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 text-white">
        <h4 className="font-bold text-sm leading-snug line-clamp-1 mb-1">{film.title}</h4>

        <div className="flex items-center gap-2 text-[11px] text-text-secondary mb-2">
          <span>{film.releaseYear}</span>
          {film.duration && <span>{formatDuration(film.duration)}</span>}
          {film.maturityRating && (
            <Badge variant="rating">{film.maturityRating}</Badge>
          )}
        </div>

        <div className="flex items-center gap-1.5 mb-2">
          <button
            onClick={handlePlay}
            className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors shadow"
            title="Play"
          >
            <Play className="h-3.5 w-3.5 fill-black ml-0.5" />
          </button>
          <button
            onClick={toggleWatchlist}
            className="w-7 h-7 rounded-full border border-white/60 bg-black/40 text-white flex items-center justify-center hover:border-white hover:bg-black/80 transition-colors"
            title={isWatchlisted ? 'Remove from My List' : 'Add to My List'}
          >
            {isWatchlisted ? <Check className="h-3.5 w-3.5 text-primary" /> : <Plus className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openFilmModal(film);
            }}
            className="w-7 h-7 rounded-full border border-white/60 bg-black/40 text-white flex items-center justify-center hover:border-white hover:bg-black/80 transition-colors ml-auto"
            title="More Info"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </div>

        {film.genres && film.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 text-[10px] text-text-muted">
            {film.genres.slice(0, 2).map((g) => (
              <span key={g.id}>• {g.name}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
