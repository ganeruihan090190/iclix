import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FilmType, Prisma } from '@prisma/client';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    genre?: string;
    year?: string;
    type?: string;
    search?: string;
    page?: string;
    limit?: string;
  }) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const where: Prisma.FilmWhereInput = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.genre) {
      where.genres = { some: { name: { equals: query.genre, mode: 'insensitive' } } };
    }

    if (query.year) {
      where.releaseYear = parseInt(query.year, 10);
    }

    if (query.type) {
      where.type = query.type.toUpperCase() as FilmType;
    }

    const [films, total] = await Promise.all([
      this.prisma.film.findMany({
        where,
        include: { genres: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.film.count({ where }),
    ]);

    return {
      data: films,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const film = await this.prisma.film.findUnique({
      where: { id },
      include: {
        genres: true,
        ratings: {
          select: { score: true },
        },
      },
    });

    if (!film) {
      throw new NotFoundException('Film not found');
    }

    const avgRating =
      film.ratings.length > 0
        ? film.ratings.reduce((sum, r) => sum + r.score, 0) / film.ratings.length
        : 0;

    return {
      ...film,
      avgRating: Math.round(avgRating * 10) / 10,
      totalRatings: film.ratings.length,
    };
  }

  async getGenres() {
    return this.prisma.genre.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getFeatured() {
    const film = await this.prisma.film.findFirst({
      where: { featured: true },
      include: { genres: true },
    });

    if (!film) {
      // Fallback to a random film
      return this.prisma.film.findFirst({
        include: { genres: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    return film;
  }

  async getTrending() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trending = await this.prisma.film.findMany({
      include: { genres: true, _count: { select: { history: true } } },
      orderBy: { history: { _count: 'desc' } },
      take: 20,
    });

    return trending;
  }

  async getTopRated() {
    const films = await this.prisma.film.findMany({
      include: {
        genres: true,
        ratings: { select: { score: true } },
      },
    });

    const withAvg = films.map((film) => {
      const avg =
        film.ratings.length > 0
          ? film.ratings.reduce((sum, r) => sum + r.score, 0) / film.ratings.length
          : 0;
      return { ...film, avgRating: Math.round(avg * 10) / 10 };
    });

    const rated = withAvg.filter((f) => f.ratings.length > 0);

    // Jika belum ada cukup film ber-rating, padati dengan film terbaru
    // agar daftar Top Rated tetap terisi di demo/seed awal
    if (rated.length < 20) {
      const ratedIds = new Set(rated.map((f) => f.id));
      const filler = withAvg
        .filter((f) => !ratedIds.has(f.id))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      rated.push(...filler.slice(0, 20 - rated.length));
    }

    return rated
      .sort((a, b) => {
        const aRated = a.ratings.length > 0 ? 1 : 0;
        const bRated = b.ratings.length > 0 ? 1 : 0;
        if (aRated !== bRated) return bRated - aRated;
        if (aRated === 0) return b.createdAt.getTime() - a.createdAt.getTime();
        return b.avgRating - a.avgRating;
      })
      .slice(0, 20);
  }

  async getNew() {
    return this.prisma.film.findMany({
      include: { genres: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}
