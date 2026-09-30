import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(profileId: string, filmId: string, dto: CreateRatingDto) {
    const film = await this.prisma.film.findUnique({ where: { id: filmId } });
    if (!film) {
      throw new NotFoundException('Film not found');
    }

    return this.prisma.rating.upsert({
      where: {
        profileId_filmId: { profileId, filmId },
      },
      update: {
        score: dto.score,
        review: dto.review,
      },
      create: {
        profileId,
        filmId,
        score: dto.score,
        review: dto.review,
      },
    });
  }

  async findOne(profileId: string, filmId: string) {
    const rating = await this.prisma.rating.findUnique({
      where: {
        profileId_filmId: { profileId, filmId },
      },
      include: {
        profile: { select: { name: true, avatarUrl: true } },
      },
    });

    // Also get aggregate
    const aggregate = await this.prisma.rating.aggregate({
      where: { filmId },
      _avg: { score: true },
      _count: { score: true },
    });

    return {
      userRating: rating,
      filmStats: {
        avgScore: aggregate._avg.score ? Math.round(aggregate._avg.score * 10) / 10 : 0,
        totalRatings: aggregate._count.score,
      },
    };
  }

  async update(profileId: string, filmId: string, dto: UpdateRatingDto) {
    const existing = await this.prisma.rating.findUnique({
      where: {
        profileId_filmId: { profileId, filmId },
      },
    });

    if (!existing) {
      throw new NotFoundException('Rating not found');
    }

    return this.prisma.rating.update({
      where: { id: existing.id },
      data: {
        ...(dto.score !== undefined && { score: dto.score }),
        ...(dto.review !== undefined && { review: dto.review }),
      },
    });
  }
}
