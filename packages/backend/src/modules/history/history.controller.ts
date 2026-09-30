import {
  Controller,
  Get,
  Headers,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('history')
@UseGuards(AuthGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  private getProfileId(profileId?: string): string {
    if (!profileId) {
      throw new BadRequestException('X-Profile-Id header is required');
    }
    return profileId;
  }

  @Get()
  findAll(@Headers('x-profile-id') profileId?: string) {
    return this.historyService.findAll(this.getProfileId(profileId));
  }

  @Get('continue')
  getContinueWatching(@Headers('x-profile-id') profileId?: string) {
    return this.historyService.getContinueWatching(this.getProfileId(profileId));
  }
}
