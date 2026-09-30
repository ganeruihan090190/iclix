import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(profileId: string) {
    const items = await this.prisma.history.findMany({
      where: { profileId },
      include: {
        film: {
          include: { genres: true },
        },
      },
      orderBy: { watchedAt: 'desc' },
    });

    return items.map((item) => ({
      id: item.id,
      progressSeconds: item.progressSeconds,
      completed: item.completed,
      watchedAt: item.watchedAt,
      film: item.film,
    }));
  }

  async getContinueWatching(profileId: string) {
    const items = await this.prisma.history.findMany({
      where: {
        profileId,
        completed: false,
        progressSeconds: { gt: 0 },
      },
      include: {
        film: {
          include: { genres: true },
        },
      },
      orderBy: { watchedAt: 'desc' },
      take: 20,
    });

    return items.map((item) => ({
      id: item.id,
      progressSeconds: item.progressSeconds,
      film: item.film,
      progressPercent: item.film.duration
        ? Math.round((item.progressSeconds / (item.film.duration * 60)) * 100)
        : 0,
    }));
  }
}
