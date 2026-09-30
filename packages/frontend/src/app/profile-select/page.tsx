'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { profilesApi } from '@/lib/api';
import type { Profile } from '@/types';

export default function ProfileSelectPage() {
  const router = useRouter();
  const { user, selectedProfile, setSelectedProfile } = useAuthStore();
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [isCreating, setIsCreating] = React.useState(false);
  const [newProfileName, setNewProfileName] = React.useState('');

  React.useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    profilesApi.list().then((list) => setProfiles(list)).catch(() => {});
  }, [user, router]);

  const selectProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    router.push('/browse');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    try {
      const created = await profilesApi.create({
        name: newProfileName.trim(),
        avatarUrl: `https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(newProfileName)}`,
      });
      setProfiles((prev) => [...prev, created]);
      setSelectedProfile(created);
      router.push('/browse');
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4">
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-10 tracking-tight">
        Who&apos;s watching?
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 max-w-3xl">
        {profiles.map((p) => (
          <div
            key={p.id}
            onClick={() => selectProfile(p)}
            className="group flex flex-col items-center gap-3 cursor-pointer"
          >
            <div className="w-24 h-24 md:w-36 md:h-36 rounded-md bg-card overflow-hidden border-2 border-transparent group-hover:border-white transition-all duration-200 group-hover:scale-105 shadow-lg flex items-center justify-center text-3xl font-bold text-text-muted">
              {p.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                p.name[0]?.toUpperCase()
              )}
            </div>
            <span className="text-sm md:text-base text-text-secondary group-hover:text-white transition-colors">
              {p.name}
            </span>
          </div>
        ))}

        {profiles.length < 5 && !isCreating && (
          <div
            onClick={() => setIsCreating(true)}
            className="group flex flex-col items-center gap-3 cursor-pointer"
          >
            <div className="w-24 h-24 md:w-36 md:h-36 rounded-md bg-card border-2 border-dashed border-border group-hover:border-white transition-all duration-200 flex items-center justify-center group-hover:scale-105">
              <Plus className="h-10 w-10 text-text-muted group-hover:text-white transition-colors" />
            </div>
            <span className="text-sm md:text-base text-text-secondary group-hover:text-white transition-colors">
              Add Profile
            </span>
          </div>
        )}
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mt-8 flex gap-3 max-w-sm w-full">
          <input
            type="text"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="Profile Name"
            autoFocus
            className="flex-1 bg-card border border-border px-4 py-2 rounded text-white text-sm focus:outline-none focus:border-white"
          />
          <button
            type="submit"
            className="bg-primary hover:bg-primary-hover text-white text-sm px-4 py-2 rounded font-bold transition-colors"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="bg-transparent border border-border text-text-secondary hover:text-white text-sm px-3 py-2 rounded"
          >
            Cancel
          </button>
        </form>
      )}

      {!isCreating && (
        <Link
          href="/profile"
          className="mt-12 border border-text-muted/60 text-text-muted hover:text-white hover:border-white px-6 py-2 text-sm tracking-widest uppercase transition-colors rounded"
        >
          Manage Profiles
        </Link>
      )}
    </div>
  );
}
