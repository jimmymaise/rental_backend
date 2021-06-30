import { Module } from '@nestjs/common';

import { BaseOrgActivityLogService } from './base-org-activity-log.service';
import { OrgActivityLogResolvers } from './org-activity-log.resolvers';
import { OrgActivityLogService } from './org-activity-log.service';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [
    BaseOrgActivityLogService,
    OrgActivityLogService,
    OrgActivityLogResolvers,
  ],
  exports: [OrgActivityLogService],
})
export class OrgActivityLogModule {}
