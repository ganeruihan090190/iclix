'use client';

import { useAuthStore } from '@/stores/auth-store';
import { authApi } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function useAuth() {
  const { user, token, selectedProfile, setAuth, setSelectedProfile, logout, isAuthenticated, isAdmin } =
    useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(email, password);
      setAuth(data.user, data.token);
      queryClient.clear();
      // If multiple profiles, redirect to profile picker; else browse
      if (data.user.profiles.length > 1) {
        router.push('/profile-select');
      } else {
        router.push('/browse');
      }
      return data;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.register(name, email, password);
      setAuth(data.user, data.token);
      queryClient.clear();
      router.push('/browse');
      return data;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    logout();
    queryClient.clear();
    router.push('/login');
  };

  return {
    user,
    token,
    selectedProfile,
    loading,
    error,
    login,
    register,
    signOut,
    setSelectedProfile,
    isAuthenticated,
    isAdmin,
  };
}
