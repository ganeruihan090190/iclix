import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { PlayerModule } from './modules/player/player.module';
import { WatchlistModule } from './modules/watchlist/watchlist.module';
import { HistoryModule } from './modules/history/history.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { AdminModule } from './modules/admin/admin.module';
import { RecommendModule } from './modules/recommend/recommend.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'iclix-dev-secret-key-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
    PrismaModule,
    AuthModule,
    ProfilesModule,
    CatalogModule,
    PlayerModule,
    WatchlistModule,
    HistoryModule,
    RatingsModule,
    AdminModule,
    RecommendModule,
  ],
})
export class AppModule {}
