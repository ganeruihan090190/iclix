import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getFilms(query?: { search?: string }) {
    const where = query?.search
      ? {
          OR: [
            { title: { contains: query.search, mode: 'insensitive' as const } },
            { description: { contains: query.search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    return this.prisma.film.findMany({
      where,
      include: { genres: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createFilm(dto: CreateFilmDto) {
    return this.prisma.film.create({
      data: {
        title: dto.title,
        description: dto.description,
        posterUrl: dto.posterUrl,
        backdropUrl: dto.backdropUrl,
        trailerUrl: dto.trailerUrl,
        videoUrl: dto.videoUrl,
        releaseYear: dto.releaseYear,
        duration: dto.duration,
        maturityRating: dto.maturityRating,
        type: dto.type,
        featured: dto.featured ?? false,
        genres: dto.genreIds
          ? { connect: dto.genreIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { genres: true },
    });
  }

  async updateFilm(id: string, dto: UpdateFilmDto) {
    const film = await this.prisma.film.findUnique({ where: { id } });
    if (!film) {
      throw new NotFoundException('Film not found');
    }

    // If genreIds provided, disconnect all and reconnect
    if (dto.genreIds) {
      await this.prisma.film.update({
        where: { id },
        data: { genres: { set: [] } },
      });
    }

    return this.prisma.film.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.posterUrl !== undefined && { posterUrl: dto.posterUrl }),
        ...(dto.backdropUrl !== undefined && { backdropUrl: dto.backdropUrl }),
        ...(dto.trailerUrl !== undefined && { trailerUrl: dto.trailerUrl }),
        ...(dto.videoUrl !== undefined && { videoUrl: dto.videoUrl }),
        ...(dto.releaseYear !== undefined && { releaseYear: dto.releaseYear }),
        ...(dto.duration !== undefined && { duration: dto.duration }),
        ...(dto.maturityRating !== undefined && { maturityRating: dto.maturityRating }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.featured !== undefined && { featured: dto.featured }),
        ...(dto.genreIds && {
          genres: { connect: dto.genreIds.map((gid) => ({ id: gid })) },
        }),
      },
      include: { genres: true },
    });
  }

  async deleteFilm(id: string) {
    const film = await this.prisma.film.findUnique({ where: { id } });
    if (!film) {
      throw new NotFoundException('Film not found');
    }

    await this.prisma.film.delete({ where: { id } });
    return { message: 'Film deleted successfully' };
  }

  async getStats() {
    const [totalFilms, totalUsers, totalViews] = await Promise.all([
      this.prisma.film.count(),
      this.prisma.user.count(),
      this.prisma.history.count(),
    ]);

    return {
      totalFilms,
      totalUsers,
      totalViews,
    };
  }
}
