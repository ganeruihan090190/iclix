'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { playerApi } from '@/lib/api';
import { VideoPlayer } from '@/components/player/video-player';
import { AuthGuard } from '@/components/layout/auth-guard';
import type { StreamInfo } from '@/types';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const filmId = params.id as string;

  const [streamInfo, setStreamInfo] = React.useState<StreamInfo | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!filmId) return;

    playerApi
      .stream(filmId)
      .then((data) => {
        setStreamInfo(data);
      })
      .catch((err) => {
        setError('Failed to load video stream');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filmId]);

  if (loading) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !streamInfo) {
    return (
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
        <h2 className="text-xl font-bold">{error || 'Video not available'}</h2>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-primary text-white rounded font-semibold hover:bg-primary-hover"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <AuthGuard>
      <VideoPlayer
        filmId={filmId}
        videoUrl={streamInfo.url}
        title={streamInfo.title}
        startAt={streamInfo.startAt}
      />
    </AuthGuard>
  );
}
