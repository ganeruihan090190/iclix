import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WatchlistService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(profileId: string) {
    const items = await this.prisma.watchlist.findMany({
      where: { profileId },
      include: {
        film: {
          include: { genres: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => ({
      id: item.id,
      addedAt: item.createdAt,
      film: item.film,
    }));
  }

  async add(profileId: string, filmId: string) {
    const film = await this.prisma.film.findUnique({ where: { id: filmId } });
    if (!film) {
      throw new NotFoundException('Film not found');
    }

    const existing = await this.prisma.watchlist.findUnique({
      where: { profileId_filmId: { profileId, filmId } },
    });

    if (existing) {
      throw new ConflictException('Film already in watchlist');
    }

    return this.prisma.watchlist.create({
      data: { profileId, filmId },
      include: { film: { include: { genres: true } } },
    });
  }

  async remove(profileId: string, filmId: string) {
    const item = await this.prisma.watchlist.findUnique({
      where: { profileId_filmId: { profileId, filmId } },
    });

    if (!item) {
      throw new NotFoundException('Film not in watchlist');
    }

    await this.prisma.watchlist.delete({
      where: { id: item.id },
    });

    return { message: 'Removed from watchlist' };
  }
}
