import { Module } from '@nestjs/common';

import { OrgStatisticLogService } from './org-statistic-log.service';
import { OrgStatisticsResolvers } from './org-statistics.resolvers';

@Module({
  providers: [OrgStatisticLogService, OrgStatisticsResolvers],
  exports: [OrgStatisticLogService],
})
export class OrgStatisticsModule {}
