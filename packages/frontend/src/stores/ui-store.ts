import { create } from 'zustand';
import type { Film } from '@/types';

interface UIState {
  isSearchOpen: boolean;
  selectedFilm: Film | null;
  isFilmModalOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  openFilmModal: (film: Film) => void;
  closeFilmModal: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isSearchOpen: false,
  selectedFilm: null,
  isFilmModalOpen: false,

  setSearchOpen: (open) => set({ isSearchOpen: open }),

  openFilmModal: (film) => set({ selectedFilm: film, isFilmModalOpen: true }),

  closeFilmModal: () => set({ isFilmModalOpen: false, selectedFilm: null }),
}));
