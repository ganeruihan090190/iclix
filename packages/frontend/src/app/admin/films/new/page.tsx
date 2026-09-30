'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { adminApi, catalogApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import type { Genre } from '@/types';

export default function NewFilmPage() {
  const router = useRouter();
  const [genres, setGenres] = React.useState<Genre[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [posterUrl, setPosterUrl] = React.useState('https://picsum.photos/seed/newfilm/400/600');
  const [backdropUrl, setBackdropUrl] = React.useState('https://picsum.photos/seed/newfilm-bg/1280/720');
  const [trailerUrl, setTrailerUrl] = React.useState('');
  const [videoUrl, setVideoUrl] = React.useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [releaseYear, setReleaseYear] = React.useState(2024);
  const [duration, setDuration] = React.useState(120);
  const [maturityRating, setMaturityRating] = React.useState('PG-13');
  const [type, setType] = React.useState<'MOVIE' | 'SERIES'>('MOVIE');
  const [featured, setFeatured] = React.useState(false);
  const [selectedGenreIds, setSelectedGenreIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    catalogApi.genres().then((data) => setGenres(data)).catch(() => {});
  }, []);

  const toggleGenre = (genreId: string) => {
    setSelectedGenreIds((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !posterUrl) {
      setError('Please fill in required fields (title, description, poster URL).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await adminApi.createFilm({
        title,
        description,
        posterUrl,
        backdropUrl: backdropUrl || undefined,
        trailerUrl: trailerUrl || undefined,
        videoUrl: videoUrl || undefined,
        releaseYear: Number(releaseYear),
        duration: duration ? Number(duration) : undefined,
        maturityRating: maturityRating || undefined,
        type,
        featured,
        genreIds: selectedGenreIds,
      });
      toast.success(`Film "${title}" created successfully`);
      router.push('/admin/films');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Failed to create film';
      setError(message || 'Failed to create film');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/films"
          className="p-2 rounded hover:bg-card text-text-secondary hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Add New Film</h1>
          <p className="text-xs text-text-muted">Create a new streaming title in the catalog.</p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded bg-primary/20 border border-primary text-primary text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-lg bg-surface border border-border space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Inception"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Synopsis of the title..."
              rows={3}
              required
              className="flex w-full rounded-md bg-card px-3 py-2 text-sm text-white placeholder:text-text-muted border border-border focus:border-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Poster URL *</label>
              <Input
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                placeholder="https://..."
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Backdrop URL</label>
              <Input
                value={backdropUrl}
                onChange={(e) => setBackdropUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Video Stream URL</label>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://...mp4 or .m3u8"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Trailer URL</label>
              <Input
                value={trailerUrl}
                onChange={(e) => setTrailerUrl(e.target.value)}
                placeholder="Optional trailer URL"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Release Year *</label>
              <Input
                type="number"
                value={releaseYear}
                onChange={(e) => setReleaseYear(Number(e.target.value))}
                min={1900}
                max={2099}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Duration (min)</label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={1}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Maturity Rating</label>
              <Input
                value={maturityRating}
                onChange={(e) => setMaturityRating(e.target.value)}
                placeholder="PG-13, R, etc."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'MOVIE' | 'SERIES')}
                className="flex h-11 w-full rounded-md bg-card px-3 py-2 text-sm text-white border border-border focus:border-white focus:outline-none"
              >
                <option value="MOVIE">Movie</option>
                <option value="SERIES">Series</option>
              </select>
            </div>
          </div>

          {/* Genres Multi-select */}
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-2">Genres</label>
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => {
                const isSelected = selectedGenreIds.includes(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => toggleGenre(g.id)}
                    className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                      isSelected
                        ? 'bg-primary border-primary text-white font-bold'
                        : 'border-border bg-card text-text-secondary hover:text-white'
                    }`}
                  >
                    {g.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded accent-primary bg-card border-border"
            />
            <label htmlFor="featured" className="text-sm font-medium text-white cursor-pointer">
              Mark as Featured Title (Displayed on Hero Billboard)
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Link href="/admin/films">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading} className="font-bold">
            {loading ? 'Saving...' : 'Create Title'}
          </Button>
        </div>
      </form>
    </div>
  );
}
