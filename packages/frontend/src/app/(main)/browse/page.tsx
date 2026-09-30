'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { HeroBanner } from '@/components/film/hero-banner';
import { FilmRow } from '@/components/film/film-row';
import {
  useFeatured,
  useTrending,
  useTopRated,
  useNewReleases,
  useFilms,
  useGenres,
} from '@/hooks/use-films';
import { historyApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import type { ContinueWatchingItem, Film } from '@/types';

function BrowseContent() {
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get('type');
  const selectedProfile = useAuthStore((s) => s.selectedProfile);

  const { data: featuredFilm } = useFeatured();
  const { data: trendingFilms } = useTrending();
  const { data: topRatedFilms } = useTopRated();
  const { data: newFilms } = useNewReleases();
  const { data: genres } = useGenres();

  // Action films
  const { data: actionFilms } = useFilms({ genre: 'Action' });
  // Sci-Fi films
  const { data: sciFiFilms } = useFilms({ genre: 'Sci-Fi' });
  // Drama films
  const { data: dramaFilms } = useFilms({ genre: 'Drama' });

  const [continueWatching, setContinueWatching] = React.useState<Film[]>([]);

  React.useEffect(() => {
    if (selectedProfile?.id) {
      historyApi
        .continueWatching()
        .then((items: ContinueWatchingItem[]) => {
          setContinueWatching(items.map((i) => i.film));
        })
        .catch(() => {});
    }
  }, [selectedProfile?.id]);

  const filterByType = React.useCallback(
    (list?: Film[]) => {
      if (!list) return [];
      if (!typeFilter) return list;
      return list.filter((f) => f.type?.toLowerCase() === typeFilter.toLowerCase());
    },
    [typeFilter]
  );

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <HeroBanner film={featuredFilm} />

      {/* Rows of films */}
      <div className="relative -mt-16 md:-mt-24 z-20 space-y-6">
        {continueWatching.length > 0 && (
          <FilmRow
            title="Continue Watching"
            films={filterByType(continueWatching)}
            aspect="landscape"
          />
        )}

        <FilmRow
          title={typeFilter ? `Trending ${typeFilter === 'series' ? 'Series' : 'Films'}` : 'Trending Now'}
          films={filterByType(trendingFilms)}
          aspect="landscape"
        />

        <FilmRow
          title="Top Rated on ICLIX"
          films={filterByType(topRatedFilms)}
          aspect="portrait"
        />

        <FilmRow
          title="New Releases"
          films={filterByType(newFilms)}
          aspect="portrait"
        />

        {actionFilms?.data && actionFilms.data.length > 0 && (
          <FilmRow
            title="Action Packed Blockbusters"
            films={filterByType(actionFilms.data)}
            aspect="landscape"
          />
        )}

        {sciFiFilms?.data && sciFiFilms.data.length > 0 && (
          <FilmRow
            title="Sci-Fi & Fantasy"
            films={filterByType(sciFiFilms.data)}
            aspect="portrait"
          />
        )}

        {dramaFilms?.data && dramaFilms.data.length > 0 && (
          <FilmRow
            title="Emotional Dramas"
            films={filterByType(dramaFilms.data)}
            aspect="portrait"
          />
        )}
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
      <BrowseContent />
    </React.Suspense>
  );
}
