import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Profile } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  selectedProfile: Profile | null;
  setAuth: (user: User, token: string) => void;
  setSelectedProfile: (profile: Profile) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      selectedProfile: null,

      setAuth: (user, token) => {
        set({ user, token });
        // Auto-select first profile if only one
        if (user.profiles.length === 1) {
          set({ selectedProfile: user.profiles[0] });
        }
      },

      setSelectedProfile: (profile) => set({ selectedProfile: profile }),

      logout: () => set({ user: null, token: null, selectedProfile: null }),

      isAuthenticated: () => !!get().token,

      isAdmin: () => get().user?.role === 'ADMIN',
    }),
    {
      name: 'iclix-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
