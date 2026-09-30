import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RecommendService {
  constructor(private readonly prisma: PrismaService) {}

  async getRecommendations(profileId: string) {
    // Get genres from films the user has watched or rated
    const [watchedFilms, ratedFilms] = await Promise.all([
      this.prisma.history.findMany({
        where: { profileId },
        select: { filmId: true, film: { select: { genres: true } } },
      }),
      this.prisma.rating.findMany({
        where: { profileId },
        select: { filmId: true, film: { select: { genres: true } } },
      }),
    ]);

    // Collect genre affinity (count occurrences)
    const genreCount: Record<string, number> = {};
    const watchedFilmIds = new Set<string>();

    for (const item of watchedFilms) {
      watchedFilmIds.add(item.filmId);
      for (const genre of item.film.genres) {
        genreCount[genre.id] = (genreCount[genre.id] || 0) + 1;
      }
    }

    for (const item of ratedFilms) {
      watchedFilmIds.add(item.filmId);
      for (const genre of item.film.genres) {
        genreCount[genre.id] = (genreCount[genre.id] || 0) + 1;
      }
    }

    // If no history, return popular films
    if (Object.keys(genreCount).length === 0) {
      return this.prisma.film.findMany({
        include: { genres: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
    }

    // Sort genres by affinity
    const topGenreIds = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id);

    // Find films with matching genres that user hasn't watched
    const recommendations = await this.prisma.film.findMany({
      where: {
        id: { notIn: Array.from(watchedFilmIds) },
        genres: { some: { id: { in: topGenreIds } } },
      },
      include: { genres: true },
      take: 20,
    });

    return recommendations;
  }
}
