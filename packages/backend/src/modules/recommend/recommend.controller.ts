import {
  Controller,
  Get,
  Headers,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { RecommendService } from './recommend.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('recommend')
@UseGuards(AuthGuard)
export class RecommendController {
  constructor(private readonly recommendService: RecommendService) {}

  @Get()
  getRecommendations(@Headers('x-profile-id') profileId?: string) {
    if (!profileId) {
      throw new BadRequestException('X-Profile-Id header is required');
    }
    return this.recommendService.getRecommendations(profileId);
  }
}
