import { Module } from '@nestjs/common';

import { OrgStatisticLogService } from './org-statistic-log.service';
import { OrgStatisticFeedService } from './org-statistic-feed.service';
import { OrgStatisticsResolvers } from './org-statistics.resolvers';

@Module({
  providers: [
    OrgStatisticLogService,
    OrgStatisticFeedService,
    OrgStatisticsResolvers,
  ],
  exports: [OrgStatisticLogService],
})
export class OrgStatisticsModule {}
