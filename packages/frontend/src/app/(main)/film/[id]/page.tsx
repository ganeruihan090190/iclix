'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Play, Plus, Check, Star } from 'lucide-react';
import { useFilm } from '@/hooks/use-films';
import { useWatchlist, useWatchlistMutations } from '@/hooks/use-watchlist';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ratingsApi, recommendApi } from '@/lib/api';
import { formatDuration } from '@/lib/utils';
import { FilmCard } from '@/components/film/film-card';
import type { Film } from '@/types';

export default function FilmDetailPage() {
  const params = useParams();
  const router = useRouter();
  const filmId = params.id as string;

  const { data: film, isLoading } = useFilm(filmId);
  const { data: watchlist } = useWatchlist();
  const { add, remove } = useWatchlistMutations(filmId);

  const [userScore, setUserScore] = React.useState<number>(0);
  const [recommendations, setRecommendations] = React.useState<Film[]>([]);

  const isWatchlisted = Boolean(
    watchlist?.some((item: { film: { id: string } }) => item.film.id === filmId)
  );

  React.useEffect(() => {
    if (!filmId) return;

    ratingsApi.get(filmId).then((res) => {
      if (res?.userRating?.score) setUserScore(res.userRating.score);
    }).catch(() => {});

    recommendApi.list().then((list) => {
      setRecommendations(list.filter((f: Film) => f.id !== filmId).slice(0, 8));
    }).catch(() => {});
  }, [filmId]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!film) {
    return (
      <div className="min-h-screen pt-24 text-center">
        <h2 className="text-2xl font-bold">Film not found</h2>
        <Button onClick={() => router.push('/browse')} className="mt-4">
          Back to Browse
        </Button>
      </div>
    );
  }

  const bgImage = film.backdropUrl || film.posterUrl || 'https://picsum.photos/seed/' + film.id + '/1280/720';

  const handleRate = async (score: number) => {
    try {
      await ratingsApi.create(filmId, score);
      setUserScore(score);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen w-full">
      {/* Top Banner */}
      <div className="relative w-full h-[60vh] md:h-[75vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end px-4 md:px-12 pb-12 max-w-4xl space-y-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white">
            {film.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <span className="font-bold text-green-500">
              {film.avgRating ? `${film.avgRating * 20}% Match` : '98% Match'}
            </span>
            <span>{film.releaseYear}</span>
            {film.duration && <span>{formatDuration(film.duration)}</span>}
            {film.maturityRating && <Badge variant="rating">{film.maturityRating}</Badge>}
            <Badge variant="outline">{film.type}</Badge>
          </div>

          <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-2xl">
            {film.description}
          </p>

          <div className="flex items-center gap-4 pt-2">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push(`/watch/${film.id}`)}
              className="font-bold gap-2"
            >
              <Play className="h-5 w-5 fill-black" /> Play
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => (isWatchlisted ? remove.mutate() : add.mutate())}
              className="gap-2 bg-card/60 border-white/20 hover:border-white"
            >
              {isWatchlisted ? <Check className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5" />}
              {isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}
            </Button>
          </div>
        </div>
      </div>

      {/* Body details + Ratings + Recommendations */}
      <div className="px-4 md:px-12 max-w-7xl mx-auto space-y-12 pb-16">
        {/* Rating Block */}
        <div className="p-6 bg-card rounded-lg border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Rate this title</h3>
            <p className="text-xs text-text-muted">
              Help us recommend more titles tailored to your preferences.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                className="p-1.5 hover:scale-125 transition-transform"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= userScore ? 'text-primary fill-primary' : 'text-text-muted'
                  }`}
                />
              </button>
            ))}
            {userScore > 0 && (
              <span className="text-sm text-text-secondary ml-3 font-semibold">
                {userScore} / 5
              </span>
            )}
          </div>
        </div>

        {/* More Like This */}
        {recommendations.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">More Like This</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {recommendations.map((rec) => (
                <FilmCard key={rec.id} film={rec} aspect="portrait" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
