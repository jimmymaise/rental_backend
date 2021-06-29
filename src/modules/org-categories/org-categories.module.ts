import { Module } from '@nestjs/common';

import { OrgCategoriesService } from './org-categories.service';
import { OrgCategoriesResolvers } from './org-categories.resolvers';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import { OrgActivityLogModule } from '@app/modules/org-activity-log/org-activity-log.module';

@Module({
  imports: [RedisCacheModule, OrgActivityLogModule],
  providers: [OrgCategoriesService, OrgCategoriesResolvers],
})
export class OrgCategoriesModule {}
