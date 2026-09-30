'use client';

import * as React from 'react';
import Link from 'next/link';
import { Film, Users, Eye, Plus, ArrowRight, Play } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import type { AdminStats, Film as FilmType } from '@/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<AdminStats | null>(null);
  const [recentFilms, setRecentFilms] = React.useState<FilmType[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([adminApi.stats(), adminApi.films()])
      .then(([statsData, filmsData]) => {
        setStats(statsData);
        setRecentFilms(filmsData.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-text-muted">Manage catalog, monitor users, and streaming statistics.</p>
        </div>
        <Link href="/admin/films/new">
          <Button className="gap-2 font-bold">
            <Plus className="h-4 w-4" /> Add New Film
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="p-6 rounded-lg bg-surface border border-border shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Film className="h-8 w-8" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-text-muted font-medium">Total Films</p>
            <p className="text-3xl font-extrabold text-white mt-1">
              {loading ? '-' : stats?.totalFilms || 0}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-surface border border-border shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-text-muted font-medium">Registered Users</p>
            <p className="text-3xl font-extrabold text-white mt-1">
              {loading ? '-' : stats?.totalUsers || 0}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-surface border border-border shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-500/10 text-green-400">
            <Eye className="h-8 w-8" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-text-muted font-medium">Total Streams</p>
            <p className="text-3xl font-extrabold text-white mt-1">
              {loading ? '-' : stats?.totalViews || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Catalog Section */}
      <div className="rounded-lg bg-surface border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recently Added Titles</h2>
          <Link
            href="/admin/films"
            className="text-xs text-primary hover:text-primary-hover font-semibold flex items-center gap-1"
          >
            View all catalog <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-card/60 animate-pulse rounded" />
            ))}
          </div>
        ) : recentFilms.length > 0 ? (
          <div className="divide-y divide-border">
            {recentFilms.map((film) => (
              <div key={film.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={film.posterUrl}
                    alt={film.title}
                    className="w-10 h-14 object-cover rounded bg-card"
                  />
                  <div>
                    <h3 className="font-semibold text-white text-sm">{film.title}</h3>
                    <p className="text-xs text-text-muted">
                      {film.releaseYear} • {film.type} • {film.genres?.map((g) => g.name).join(', ') || 'No genre'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/films/${film.id}/edit`}
                    className="text-xs px-3 py-1.5 rounded border border-border hover:bg-card text-text-secondary hover:text-white transition-colors"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/watch/${film.id}`}
                    className="text-xs px-3 py-1.5 rounded bg-card hover:bg-neutral-800 text-white transition-colors flex items-center gap-1"
                  >
                    <Play className="h-3 w-3 fill-white" /> Preview
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted py-6 text-center">No films in database.</p>
        )}
      </div>
    </div>
  );
}
