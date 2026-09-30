import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Headers,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('watchlist')
@UseGuards(AuthGuard)
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  private getProfileId(profileId?: string): string {
    if (!profileId) {
      throw new BadRequestException('X-Profile-Id header is required');
    }
    return profileId;
  }

  @Get()
  findAll(@Headers('x-profile-id') profileId?: string) {
    return this.watchlistService.findAll(this.getProfileId(profileId));
  }

  @Post(':filmId')
  add(
    @Headers('x-profile-id') profileId: string | undefined,
    @Param('filmId') filmId: string,
  ) {
    return this.watchlistService.add(this.getProfileId(profileId), filmId);
  }

  @Delete(':filmId')
  remove(
    @Headers('x-profile-id') profileId: string | undefined,
    @Param('filmId') filmId: string,
  ) {
    return this.watchlistService.remove(this.getProfileId(profileId), filmId);
  }
}
