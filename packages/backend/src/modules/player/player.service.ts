import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SaveProgressDto } from './dto/save-progress.dto';

@Injectable()
export class PlayerService {
  constructor(private readonly prisma: PrismaService) {}

  async getStream(filmId: string, profileId?: string) {
    const film = await this.prisma.film.findUnique({
      where: { id: filmId },
      select: { id: true, videoUrl: true, title: true, duration: true },
    });

    if (!film) {
      throw new NotFoundException('Film not found');
    }

    let startAt = 0;

    if (profileId) {
      const history = await this.prisma.history.findUnique({
        where: {
          profileId_filmId: { profileId, filmId },
        },
      });

      if (history && !history.completed) {
        startAt = history.progressSeconds;
      }
    }

    return {
      url: film.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      title: film.title,
      duration: film.duration,
      startAt,
    };
  }

  async saveProgress(filmId: string, dto: SaveProgressDto) {
    const film = await this.prisma.film.findUnique({ where: { id: filmId } });

    if (!film) {
      throw new NotFoundException('Film not found');
    }

    return this.prisma.history.upsert({
      where: {
        profileId_filmId: {
          profileId: dto.profileId,
          filmId,
        },
      },
      update: {
        progressSeconds: dto.seconds,
        completed: dto.completed ?? false,
        watchedAt: new Date(),
      },
      create: {
        profileId: dto.profileId,
        filmId,
        progressSeconds: dto.seconds,
        completed: dto.completed ?? false,
      },
    });
  }
}
