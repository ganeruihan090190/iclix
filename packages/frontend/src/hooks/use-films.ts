'use client';

import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/lib/api';

export function useFilms(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['films', params],
    queryFn: () => catalogApi.films(params),
  });
}

export function useFilm(id: string) {
  return useQuery({
    queryKey: ['film', id],
    queryFn: () => catalogApi.film(id),
    enabled: !!id,
  });
}

export function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: () => catalogApi.genres(),
    staleTime: Infinity,
  });
}

export function useFeatured() {
  return useQuery({
    queryKey: ['featured'],
    queryFn: () => catalogApi.featured(),
  });
}

export function useTrending() {
  return useQuery({
    queryKey: ['trending'],
    queryFn: () => catalogApi.trending(),
  });
}

export function useTopRated() {
  return useQuery({
    queryKey: ['top-rated'],
    queryFn: () => catalogApi.topRated(),
  });
}

export function useNewReleases() {
  return useQuery({
    queryKey: ['new-releases'],
    queryFn: () => catalogApi.newReleases(),
  });
}

export function useRecommendations() {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: () => catalogApi.featured(), // fallback, real one uses recommend endpoint
  });
}
