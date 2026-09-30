export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  profiles: Profile[];
}

export interface Profile {
  id: string;
  name: string;
  avatarUrl?: string;
  userId: string;
  createdAt: string;
}

export interface Genre {
  id: string;
  name: string;
}

export interface Film {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl?: string;
  trailerUrl?: string;
  videoUrl?: string;
  releaseYear: number;
  duration?: number;
  maturityRating?: string;
  type: 'MOVIE' | 'SERIES';
  featured: boolean;
  genres: Genre[];
  avgRating?: number;
  totalRatings?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FilmDetail extends Film {
  avgRating: number;
  totalRatings: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface WatchlistItem {
  id: string;
  addedAt: string;
  film: Film;
}

export interface HistoryItem {
  id: string;
  progressSeconds: number;
  completed: boolean;
  watchedAt: string;
  film: Film;
}

export interface ContinueWatchingItem {
  id: string;
  progressSeconds: number;
  progressPercent: number;
  film: Film;
}

export interface Rating {
  id: string;
  score: number;
  review?: string;
  profileId: string;
  filmId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RatingResponse {
  userRating: Rating | null;
  filmStats: {
    avgScore: number;
    totalRatings: number;
  };
}

export interface StreamInfo {
  url: string;
  title: string;
  duration?: number;
  startAt: number;
}

export interface AdminStats {
  totalFilms: number;
  totalUsers: number;
  totalViews: number;
}
