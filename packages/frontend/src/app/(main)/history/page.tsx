'use client';

import * as React from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { historyApi } from '@/lib/api';
import { formatDuration } from '@/lib/utils';
import type { HistoryItem } from '@/types';

export default function HistoryPage() {
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    historyApi
      .list()
      .then((items) => setHistory(items))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-24 px-4 md:px-12 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Viewing History</h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-card/60 animate-pulse rounded-md" />
          ))}
        </div>
      ) : history.length > 0 ? (
        <div className="space-y-3">
          {history.map((item) => {
            const film = item.film;
            const progressMin = Math.floor(item.progressSeconds / 60);

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-card rounded-md border border-border hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={film.posterUrl}
                    alt={film.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-bold text-white text-base">{film.title}</h3>
                    <p className="text-xs text-text-muted">
                      Watched: {new Date(item.watchedAt).toLocaleDateString()} • Progress: {progressMin}m / {film.duration || 0}m
                    </p>
                  </div>
                </div>

                <Link
                  href={`/watch/${film.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-colors"
                >
                  <Play className="h-3.5 w-3.5 fill-white" /> Resume
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 text-center space-y-3">
          <p className="text-xl text-text-secondary">No viewing history found.</p>
          <p className="text-sm text-text-muted">
            Titles you play will automatically appear here.
          </p>
        </div>
      )}
    </div>
  );
}
