import { UseGuards } from '@nestjs/common';
import { Args, Resolver, Query } from '@nestjs/graphql';

import { QueryWithOffsetPagingDTO } from '@app/models';
import { BaseOrgActivityLogService } from './base-org-activity-log.service';
import { Permission } from '@modules/auth/permission/permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { BaseOrgActivityLogModel } from './models';
import { GuardUserPayload, CurrentUser, GqlAuthGuard } from '../auth';
import { OffsetPaginationDTO } from '../../models';
import { OrgActivityLogType } from './constants/org-activity-log-type.enum';

@Resolver('OrgActivityLog')
export class OrgActivityLogResolvers {
  constructor(
    private readonly baseOrgActivityLogServices: BaseOrgActivityLogService,
  ) {}

  // @Query()
  // @Permissions(Permission.ORG_MASTER, Permission.GET_ORG_ACTIVITY_LOG)
  // @UseGuards(GqlAuthGuard)
  // async getAllOrgActivityLog(
  //   @CurrentUser() user: GuardUserPayload,
  // ): Promise<BaseOrgActivityLogModel[]> {
  //   return this.baseOrgActivityLogServices.getAllOrgActivityLog(
  //     user.currentOrgId,
  //   );
  // }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_ORG_ACTIVITY_LOG)
  @UseGuards(GqlAuthGuard)
  async getMyOrgActivityLogsWithPaging(
    @CurrentUser() user: GuardUserPayload,
    @Args('data')
    data: QueryWithOffsetPagingDTO,
    @Args('type')
    type: OrgActivityLogType,
  ): Promise<OffsetPaginationDTO<BaseOrgActivityLogModel>> {
    return this.baseOrgActivityLogServices.getOrgActivityLogWithOffsetPaging(
      user.currentOrgId,
      {
        pageSize: data.pageSize,
        offset: data.offset,
        type,
      },
    );
  }
}
