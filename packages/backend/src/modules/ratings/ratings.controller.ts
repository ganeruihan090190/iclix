import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Headers,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('ratings')
@UseGuards(AuthGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  private getProfileId(profileId?: string): string {
    if (!profileId) {
      throw new BadRequestException('X-Profile-Id header is required');
    }
    return profileId;
  }

  @Post(':filmId')
  create(
    @Headers('x-profile-id') profileId: string | undefined,
    @Param('filmId') filmId: string,
    @Body() dto: CreateRatingDto,
  ) {
    return this.ratingsService.create(this.getProfileId(profileId), filmId, dto);
  }

  @Get(':filmId')
  findOne(
    @Headers('x-profile-id') profileId: string | undefined,
    @Param('filmId') filmId: string,
  ) {
    return this.ratingsService.findOne(this.getProfileId(profileId), filmId);
  }

  @Patch(':filmId')
  update(
    @Headers('x-profile-id') profileId: string | undefined,
    @Param('filmId') filmId: string,
    @Body() dto: UpdateRatingDto,
  ) {
    return this.ratingsService.update(this.getProfileId(profileId), filmId, dto);
  }
}
