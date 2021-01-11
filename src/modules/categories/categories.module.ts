import { Module } from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { CategoriesResolvers } from './categories.resolvers';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';

@Module({
  imports: [RedisCacheModule],
  providers: [CategoriesService, CategoriesResolvers],
})
export class CategoriesModule {}
