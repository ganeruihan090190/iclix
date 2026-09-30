import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('films')
  findAll(
    @Query('genre') genre?: string,
    @Query('year') year?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.catalogService.findAll({ genre, year, type, search, page, limit });
  }

  @Get('genres')
  getGenres() {
    return this.catalogService.getGenres();
  }

  @Get('featured')
  getFeatured() {
    return this.catalogService.getFeatured();
  }

  @Get('trending')
  getTrending() {
    return this.catalogService.getTrending();
  }

  @Get('top-rated')
  getTopRated() {
    return this.catalogService.getTopRated();
  }

  @Get('new')
  getNew() {
    return this.catalogService.getNew();
  }

  @Get('films/:id')
  findOne(@Param('id') id: string) {
    return this.catalogService.findOne(id);
  }
}
