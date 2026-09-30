import axios, { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth-store';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT + X-Profile-Id
api.interceptors.request.use((config) => {
  // Access store directly (outside React)
  const state = useAuthStore.getState();
  if (state.token) {
    config.headers['Authorization'] = `Bearer ${state.token}`;
  }
  if (state.selectedProfile?.id) {
    config.headers['X-Profile-Id'] = state.selectedProfile.id;
  }
  return config;
});

// Response interceptor: handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// Typed API helpers
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};

export const profilesApi = {
  list: () => api.get('/profiles').then((r) => r.data),
  create: (data: { name: string; avatarUrl?: string }) =>
    api.post('/profiles', data).then((r) => r.data),
  update: (id: string, data: { name?: string; avatarUrl?: string }) =>
    api.patch(`/profiles/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/profiles/${id}`).then((r) => r.data),
};

export const catalogApi = {
  films: (params?: Record<string, string>) =>
    api.get('/catalog/films', { params }).then((r) => r.data),
  film: (id: string) => api.get(`/catalog/films/${id}`).then((r) => r.data),
  genres: () => api.get('/catalog/genres').then((r) => r.data),
  featured: () => api.get('/catalog/featured').then((r) => r.data),
  trending: () => api.get('/catalog/trending').then((r) => r.data),
  topRated: () => api.get('/catalog/top-rated').then((r) => r.data),
  newReleases: () => api.get('/catalog/new').then((r) => r.data),
};

export const playerApi = {
  stream: (filmId: string) => api.get(`/player/${filmId}/stream`).then((r) => r.data),
  progress: (filmId: string, profileId: string, seconds: number, completed = false) =>
    api.post(`/player/${filmId}/progress`, { profileId, seconds, completed }).then((r) => r.data),
};

export const watchlistApi = {
  list: () => api.get('/watchlist').then((r) => r.data),
  add: (filmId: string) => api.post(`/watchlist/${filmId}`).then((r) => r.data),
  remove: (filmId: string) => api.delete(`/watchlist/${filmId}`).then((r) => r.data),
};

export const historyApi = {
  list: () => api.get('/history').then((r) => r.data),
  continueWatching: () => api.get('/history/continue').then((r) => r.data),
};

export const ratingsApi = {
  get: (filmId: string) => api.get(`/ratings/${filmId}`).then((r) => r.data),
  create: (filmId: string, score: number, review?: string) =>
    api.post(`/ratings/${filmId}`, { score, review }).then((r) => r.data),
  update: (filmId: string, score?: number, review?: string) =>
    api.patch(`/ratings/${filmId}`, { score, review }).then((r) => r.data),
};

export const recommendApi = {
  list: () => api.get('/recommend').then((r) => r.data),
};

export const adminApi = {
  films: (search?: string) =>
    api.get('/admin/films', { params: search ? { search } : undefined }).then((r) => r.data),
  createFilm: (data: Record<string, unknown>) =>
    api.post('/admin/films', data).then((r) => r.data),
  updateFilm: (id: string, data: Record<string, unknown>) =>
    api.patch(`/admin/films/${id}`, data).then((r) => r.data),
  deleteFilm: (id: string) => api.delete(`/admin/films/${id}`).then((r) => r.data),
  stats: () => api.get('/admin/stats').then((r) => r.data),
};
