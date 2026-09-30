'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { useFilms, useGenres } from '@/hooks/use-films';
import { FilmCard } from '@/components/film/film-card';
import { Film } from '@/types';
import { Input } from '@/components/ui/input';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = React.useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = React.useState('');
  const [selectedType, setSelectedType] = React.useState('');
  const [selectedYear, setSelectedYear] = React.useState('');

  const { data: genres } = useGenres();

  const queryParams: Record<string, string> = {};
  if (searchTerm) queryParams.search = searchTerm;
  if (selectedGenre) queryParams.genre = selectedGenre;
  if (selectedType) queryParams.type = selectedType;
  if (selectedYear) queryParams.year = selectedYear;

  const { data: filmsData, isLoading } = useFilms(queryParams);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const years = [2024, 2023, 2022, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2010, 2008, 1999, 1994];

  return (
    <div className="pt-24 px-4 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="space-y-6 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Search & Browse</h1>

        {/* Search Bar + Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search films, genres, actors..."
              className="pl-10"
            />
            <SearchIcon className="h-5 w-5 absolute left-3 top-3 text-text-muted" />
          </div>

          {/* Genre select */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="h-11 rounded-md bg-card px-3 text-sm text-white border border-border focus:border-white focus:outline-none"
          >
            <option value="">All Genres</option>
            {genres?.map((g: { id: string; name: string }) => (
              <option key={g.id} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>

          {/* Type select */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-11 rounded-md bg-card px-3 text-sm text-white border border-border focus:border-white focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="movie">Movies</option>
            <option value="series">Series</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-card/60 animate-pulse rounded-md" />
          ))}
        </div>
      ) : filmsData?.data && filmsData.data.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filmsData.data.map((film: Film) => (
            <FilmCard key={film.id} film={film} aspect="portrait" />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-3">
          <p className="text-xl text-text-secondary">No matching titles found.</p>
          <p className="text-sm text-text-muted">
            Try checking your spelling or adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SearchContent />
    </React.Suspense>
  );
}
