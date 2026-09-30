'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { User, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { profilesApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import type { Profile } from '@/types';

export default function ProfileManagementPage() {
  const router = useRouter();
  const { user, selectedProfile, setSelectedProfile, setAuth, token } = useAuthStore();
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Add profile modal
  const [isAdding, setIsAdding] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [addLoading, setAddLoading] = React.useState(false);

  // Edit profile modal
  const [editingProfile, setEditingProfile] = React.useState<Profile | null>(null);
  const [editName, setEditName] = React.useState('');
  const [editAvatarUrl, setEditAvatarUrl] = React.useState('');
  const [editLoading, setEditLoading] = React.useState(false);

  // Delete modal
  const [deletingProfile, setDeletingProfile] = React.useState<Profile | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const fetchProfiles = () => {
    setLoading(true);
    profilesApi
      .list()
      .then((data) => {
        setProfiles(data);
        if (user && token) {
          setAuth({ ...user, profiles: data }, token);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSelect = (profile: Profile) => {
    setSelectedProfile(profile);
    router.push('/browse');
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAddLoading(true);
    try {
      const created = await profilesApi.create({
        name: newName.trim(),
        avatarUrl: `https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(newName.trim())}`,
      });
      setIsAdding(false);
      setNewName('');
      fetchProfiles();
    } catch {
      // ignore
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditOpen = (p: Profile, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProfile(p);
    setEditName(p.name);
    setEditAvatarUrl(p.avatarUrl || '');
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile || !editName.trim()) return;
    setEditLoading(true);
    try {
      await profilesApi.update(editingProfile.id, {
        name: editName.trim(),
        avatarUrl: editAvatarUrl || undefined,
      });
      if (selectedProfile?.id === editingProfile.id) {
        setSelectedProfile({
          ...selectedProfile,
          name: editName.trim(),
          avatarUrl: editAvatarUrl || undefined,
        });
      }
      setEditingProfile(null);
      fetchProfiles();
    } catch {
      // ignore
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteOpen = (p: Profile, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingProfile(p);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProfile) return;
    setDeleteLoading(true);
    try {
      await profilesApi.remove(deletingProfile.id);
      if (selectedProfile?.id === deletingProfile.id) {
        const remaining = profiles.filter((p) => p.id !== deletingProfile.id);
        if (remaining.length > 0) setSelectedProfile(remaining[0]);
      }
      setDeletingProfile(null);
      fetchProfiles();
    } catch {
      // ignore
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="pt-24 px-4 md:px-12 max-w-4xl mx-auto min-h-screen space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Account & Profiles</h1>
        <p className="text-sm text-text-muted mt-1">Manage who is watching and customize profile settings.</p>
      </div>

      {/* Account Info Card */}
      <div className="p-6 rounded-lg bg-surface border border-border flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-text-muted font-semibold">Account Email</p>
          <p className="text-lg font-bold text-white">{user?.email}</p>
          <span className="inline-block text-xs bg-card px-2 py-0.5 rounded border border-border text-text-secondary mt-1">
            Role: {user?.role}
          </span>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Your Profiles</h2>
          {profiles.length < 5 && (
            <Button size="sm" onClick={() => setIsAdding(true)} className="gap-1.5 font-semibold">
              <Plus className="h-4 w-4" /> Add Profile
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-card/60 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profiles.map((p) => {
              const isCurrent = selectedProfile?.id === p.id;

              return (
                <div
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  className={`p-4 rounded-lg bg-surface border transition-all cursor-pointer flex items-center justify-between group ${
                    isCurrent ? 'border-primary shadow-md' : 'border-border hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md bg-card border border-white/20 overflow-hidden flex items-center justify-center font-bold text-sm text-text-muted">
                      {p.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        p.name[0]?.toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base">{p.name}</h3>
                        {isCurrent && (
                          <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-muted">Click to switch</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleEditOpen(p, e)}
                      title="Edit Profile"
                      className="p-2 rounded hover:bg-card text-text-secondary hover:text-white transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {profiles.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteOpen(p, e)}
                        title="Delete Profile"
                        className="p-2 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Profile Modal */}
      <Modal isOpen={isAdding} onClose={() => setIsAdding(false)} maxWidth="max-w-md">
        <form onSubmit={handleAdd} className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-white">Add Profile</h3>
          <p className="text-xs text-text-muted">Add a profile for another person watching ICLIX.</p>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name"
            autoFocus
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addLoading}>
              {addLoading ? 'Adding...' : 'Continue'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal isOpen={!!editingProfile} onClose={() => setEditingProfile(null)} maxWidth="max-w-md">
        <form onSubmit={handleEditSave} className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-white">Edit Profile</h3>
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1">Profile Name</label>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Profile Name"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1">Avatar URL</label>
            <Input
              value={editAvatarUrl}
              onChange={(e) => setEditAvatarUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setEditingProfile(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={editLoading}>
              {editLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Profile Confirmation Modal */}
      <Modal isOpen={!!deletingProfile} onClose={() => setDeletingProfile(null)} maxWidth="max-w-md">
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-white">Delete Profile?</h3>
          <p className="text-sm text-text-secondary">
            This profile&apos;s history, watchlist, and ratings will be permanently gone. Are you sure you want to delete <strong className="text-white">{deletingProfile?.name}</strong>?
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setDeletingProfile(null)}>
              Cancel
            </Button>
            <Button variant="danger" disabled={deleteLoading} onClick={handleDeleteConfirm}>
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
