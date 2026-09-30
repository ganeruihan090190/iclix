'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, Plus, Pencil, Trash2, AlertTriangle, Play } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { toast } from '@/components/ui/toast';
import type { Film } from '@/types';

export default function AdminFilmsPage() {
  const [films, setFilms] = React.useState<Film[]>([]);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  // Delete modal state
  const [deletingFilm, setDeletingFilm] = React.useState<Film | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const fetchFilms = (searchTerm?: string) => {
    setLoading(true);
    adminApi
      .films(searchTerm)
      .then((data) => setFilms(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    fetchFilms();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilms(search);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingFilm) return;
    setDeleteLoading(true);
    try {
      await adminApi.deleteFilm(deletingFilm.id);
      setFilms((prev) => prev.filter((f) => f.id !== deletingFilm.id));
      toast.success(`Deleted "${deletingFilm.title}"`);
      setDeletingFilm(null);
    } catch {
      toast.error('Failed to delete film');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Film Management</h1>
          <p className="text-sm text-text-muted">Browse, search, edit or add streaming catalog items.</p>
        </div>
        <Link href="/admin/films/new">
          <Button className="gap-2 font-bold">
            <Plus className="h-4 w-4" /> Add Film
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or description..."
            className="pl-9"
          />
          <Search className="h-4 w-4 absolute left-3 top-3.5 text-text-muted" />
        </div>
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      {/* Film Table */}
      <div className="rounded-lg bg-surface border border-border overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-card text-text-secondary text-xs uppercase tracking-wider border-b border-border">
              <tr>
                <th className="px-4 py-3">Poster</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Genres</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                    Loading films...
                  </td>
                </tr>
              ) : films.length > 0 ? (
                films.map((film) => (
                  <tr key={film.id} className="hover:bg-card/40 transition-colors">
                    <td className="px-4 py-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={film.posterUrl}
                        alt={film.title}
                        className="w-10 h-14 object-cover rounded bg-card"
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {film.title}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      <span className="text-xs px-2 py-0.5 rounded bg-card border border-border">
                        {film.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{film.releaseYear}</td>
                    <td className="px-4 py-3 text-text-secondary text-xs max-w-xs truncate">
                      {film.genres?.map((g) => g.name).join(', ') || '-'}
                    </td>
                    <td className="px-4 py-3">
                      {film.featured ? (
                        <span className="text-xs bg-primary/20 text-primary border border-primary/40 px-2 py-0.5 rounded font-bold">
                          FEATURED
                        </span>
                      ) : (
                        <span className="text-xs text-text-muted">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/watch/${film.id}`}
                          title="Preview Video"
                          className="p-1.5 rounded hover:bg-card text-text-secondary hover:text-white"
                        >
                          <Play className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/films/${film.id}/edit`}
                          title="Edit Film"
                          className="p-1.5 rounded hover:bg-card text-text-secondary hover:text-white"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeletingFilm(film)}
                          title="Delete Film"
                          className="p-1.5 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                    No films found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deletingFilm} onClose={() => setDeletingFilm(null)} maxWidth="max-w-md">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-red-500">
            <AlertTriangle className="h-6 w-6" />
            <h3 className="text-lg font-bold text-white">Delete Film</h3>
          </div>
          <p className="text-sm text-text-secondary">
            Are you sure you want to delete <strong className="text-white">{deletingFilm?.title}</strong>? This action cannot be undone and will remove all viewing history, ratings, and watchlist references.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setDeletingFilm(null)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
