import { Controller, Get, Post, Param, Body, Headers, UseGuards } from '@nestjs/common';
import { PlayerService } from './player.service';
import { SaveProgressDto } from './dto/save-progress.dto';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('player')
@UseGuards(AuthGuard)
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get(':filmId/stream')
  getStream(
    @Param('filmId') filmId: string,
    @Headers('x-profile-id') profileId?: string,
  ) {
    return this.playerService.getStream(filmId, profileId);
  }

  @Post(':filmId/progress')
  saveProgress(
    @Param('filmId') filmId: string,
    @Body() dto: SaveProgressDto,
  ) {
    return this.playerService.saveProgress(filmId, dto);
  }
}
