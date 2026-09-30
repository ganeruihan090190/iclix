import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';

@Controller('admin')
@UseGuards(AuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  private assertAdmin(user: JwtPayload) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }
  }

  @Get('films')
  getFilms(
    @CurrentUser() user: JwtPayload,
    @Query('search') search?: string,
  ) {
    this.assertAdmin(user);
    return this.adminService.getFilms({ search });
  }

  @Post('films')
  createFilm(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateFilmDto,
  ) {
    this.assertAdmin(user);
    return this.adminService.createFilm(dto);
  }

  @Patch('films/:id')
  updateFilm(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateFilmDto,
  ) {
    this.assertAdmin(user);
    return this.adminService.updateFilm(id, dto);
  }

  @Delete('films/:id')
  deleteFilm(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    this.assertAdmin(user);
    return this.adminService.deleteFilm(id);
  }

  @Get('stats')
  getStats(@CurrentUser() user: JwtPayload) {
    this.assertAdmin(user);
    return this.adminService.getStats();
  }
}
