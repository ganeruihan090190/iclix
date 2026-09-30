'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { watchlistApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from '@/components/ui/toast';

export function useWatchlist() {
  const selectedProfile = useAuthStore((s) => s.selectedProfile);

  return useQuery({
    queryKey: ['watchlist', selectedProfile?.id],
    queryFn: () => watchlistApi.list(),
    enabled: !!selectedProfile,
  });
}

export function useWatchlistMutations(filmId: string) {
  const qc = useQueryClient();
  const selectedProfile = useAuthStore((s) => s.selectedProfile);

  const add = useMutation({
    mutationFn: () => watchlistApi.add(filmId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['watchlist', selectedProfile?.id] });
      toast.success('Added to My List');
    },
    onError: () => {
      toast.error('Failed to add to My List');
    },
  });

  const remove = useMutation({
    mutationFn: () => watchlistApi.remove(filmId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['watchlist', selectedProfile?.id] });
      toast.info('Removed from My List');
    },
    onError: () => {
      toast.error('Failed to remove from My List');
    },
  });

  return { add, remove };
}
