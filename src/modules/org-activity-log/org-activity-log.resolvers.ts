import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { BaseOrgActivityLogService } from './base-org-activity-log.service';
import { Permission } from '@modules/auth/permission/permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { BaseOrgActivityLogModel } from './models';
import { GuardUserPayload, CurrentUser, GqlAuthGuard } from '../auth';

@Resolver('OrgActivityLog')
export class OrgActivityLogResolvers {
  constructor(
    private readonly baseOrgActivityLogServices: BaseOrgActivityLogService,
  ) {}

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_ORG_ACTIVITY_LOG)
  @UseGuards(GqlAuthGuard)
  async getAllOrgActivityLog(
    @CurrentUser() user: GuardUserPayload,
  ): Promise<BaseOrgActivityLogModel[]> {
    return this.baseOrgActivityLogServices.getAllOrgActivityLog(
      user.currentOrgId,
    );
  }
}
