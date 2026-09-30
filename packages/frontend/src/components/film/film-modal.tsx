'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Play, Plus, Check, Star } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIStore } from '@/stores/ui-store';
import { useWatchlist, useWatchlistMutations } from '@/hooks/use-watchlist';
import { toast } from '@/components/ui/toast';
import { useFilm } from '@/hooks/use-films';
import { ratingsApi, recommendApi } from '@/lib/api';
import { formatDuration } from '@/lib/utils';
import type { Film } from '@/types';
import { FilmCard } from './film-card';

export function FilmModal() {
  const router = useRouter();
  const { isFilmModalOpen, closeFilmModal, selectedFilm } = useUIStore();
  const { data: detailedFilm } = useFilm(selectedFilm?.id || '');
  const { data: watchlist } = useWatchlist();
  const { add, remove } = useWatchlistMutations(selectedFilm?.id || '');

  const [userScore, setUserScore] = React.useState<number>(0);
  const [recommendations, setRecommendations] = React.useState<Film[]>([]);
  const [ratingLoading, setRatingLoading] = React.useState(false);

  const film = detailedFilm || selectedFilm;

  const isWatchlisted = Boolean(
    watchlist?.some((item: { film: { id: string } }) => item.film.id === film?.id)
  );

  React.useEffect(() => {
    if (!film?.id) return;

    // Load rating
    ratingsApi.get(film.id).then((res) => {
      if (res?.userRating?.score) {
        setUserScore(res.userRating.score);
      } else {
        setUserScore(0);
      }
    }).catch(() => {});

    // Load recommendations
    recommendApi.list().then((films) => {
      setRecommendations(films.filter((f: Film) => f.id !== film.id).slice(0, 6));
    }).catch(() => {});
  }, [film?.id]);

  if (!film) return null;

  const handleRate = async (score: number) => {
    if (!film.id) return;
    setRatingLoading(true);
    try {
      await ratingsApi.create(film.id, score);
      setUserScore(score);
      toast.success(`Rated ${score} of 5 stars`);
    } catch {
      toast.error('Failed to submit rating');
    } finally {
      setRatingLoading(false);
    }
  };

  const handlePlay = () => {
    closeFilmModal();
    router.push(`/watch/${film.id}`);
  };

  const bgImage = film.backdropUrl || film.posterUrl || 'https://picsum.photos/seed/' + film.id + '/1280/720';

  return (
    <Modal isOpen={isFilmModalOpen} onClose={closeFilmModal}>
      {/* Top Banner with Backdrop */}
      <div className="relative h-64 md:h-96 w-full">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-4xl font-black text-white drop-shadow-md">
              {film.title}
            </h2>
            <div className="flex items-center gap-3">
              <Button onClick={handlePlay} variant="secondary" size="md" className="font-bold gap-2">
                <Play className="h-4 w-4 fill-black" /> Play
              </Button>
              <Button
                onClick={() => (isWatchlisted ? remove.mutate() : add.mutate())}
                variant="outline"
                size="icon"
                className="rounded-full bg-black/40 border-white/50 hover:border-white"
              >
                {isWatchlisted ? <Check className="h-4 w-4 text-primary" /> : <Plus className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Content */}
      <div className="p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <span className="font-semibold text-green-500">
                {film.avgRating ? `${film.avgRating * 20}% Match` : '95% Match'}
              </span>
              <span>{film.releaseYear}</span>
              {film.duration && <span>{formatDuration(film.duration)}</span>}
              {film.maturityRating && <Badge variant="rating">{film.maturityRating}</Badge>}
            </div>

            <p className="text-sm md:text-base text-text-secondary leading-relaxed">
              {film.description}
            </p>

            {/* Rating Section */}
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-text-muted mb-2">Rate this title:</p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    disabled={ratingLoading}
                    onClick={() => handleRate(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= userScore ? 'text-primary fill-primary' : 'text-text-muted'
                      }`}
                    />
                  </button>
                ))}
                {userScore > 0 && (
                  <span className="text-xs text-text-secondary ml-2 font-medium">
                    Rated {userScore}/5
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-3 text-xs text-text-muted border-t md:border-t-0 md:border-l border-border md:pl-6 pt-4 md:pt-0">
            <div>
              <span className="text-text-secondary font-medium">Genres: </span>
              {film.genres?.map((g: { name: string }) => g.name).join(', ') || 'Various'}
            </div>
            <div>
              <span className="text-text-secondary font-medium">Format: </span>
              {film.type === 'SERIES' ? 'TV Series' : 'Feature Film'}
            </div>
            {film.avgRating !== undefined && film.avgRating > 0 && (
              <div>
                <span className="text-text-secondary font-medium">Community Score: </span>
                <span className="text-white font-bold">{film.avgRating} / 5</span> ({film.totalRatings} votes)
              </div>
            )}
          </div>
        </div>

        {/* More Like This */}
        {recommendations.length > 0 && (
          <div className="pt-6 border-t border-border">
            <h3 className="text-lg font-bold text-white mb-4">More Like This</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {recommendations.map((rec) => (
                <FilmCard key={rec.id} film={rec} aspect="portrait" />
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
