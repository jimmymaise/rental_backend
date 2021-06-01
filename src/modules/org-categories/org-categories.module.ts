import { Module } from '@nestjs/common';

import { OrgCategoriesService } from './org-categories.service';
import { OrgCategoriesResolvers } from './org-categories.resolvers';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';

@Module({
  imports: [RedisCacheModule],
  providers: [OrgCategoriesService, OrgCategoriesResolvers],
})
export class OrgCategoriesModule {}
