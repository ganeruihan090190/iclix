'use client';

import { useEffect, useRef, useCallback } from 'react';
import { playerApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';

export function usePlayerProgress(filmId: string) {
  const selectedProfile = useAuthStore((s) => s.selectedProfile);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef(0);

  const saveProgress = useCallback(
    async (seconds: number, completed = false) => {
      if (!selectedProfile) return;
      try {
        await playerApi.progress(filmId, selectedProfile.id, seconds, completed);
      } catch {
        // silently fail
      }
    },
    [filmId, selectedProfile]
  );

  const startTracking = useCallback(
    (getSeconds: () => number) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        const secs = getSeconds();
        secondsRef.current = secs;
        saveProgress(secs);
      }, 10000);
    },
    [saveProgress]
  );

  const stopTracking = useCallback(
    (completed = false) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      saveProgress(secondsRef.current, completed);
    },
    [saveProgress]
  );

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { startTracking, stopTracking, saveProgress };
}
