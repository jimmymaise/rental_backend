import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { OrgStatisticFeedService } from './org-statistic-feed.service';
import { Permission } from '@modules/auth/permission/permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { GuardUserPayload, CurrentUser, GqlAuthGuard } from '../auth';
import { StatisticEntryGroupByTypes } from './constants';
import { TopItemInTimeRangeModel, TopCategoryInTimeRangeModel } from './models';

function toLocalStatictis(inputData: any): any {
  return {
    entryDateTime: inputData.entryDateTime.getTime(),
    ...inputData,
  };
}

@Resolver('OrgStatistic')
export class OrgStatisticsResolvers {
  constructor(
    private readonly orgStatisticFeedService: OrgStatisticFeedService,
  ) {}

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_ORG_STATISTICS_LOG)
  @UseGuards(GqlAuthGuard)
  async feedOrderStatistics(
    @CurrentUser() user: GuardUserPayload,
    @Args('fromDate') fromDate: number,
    @Args('toDate') toDate: number,
    @Args('groupBy') groupBy: StatisticEntryGroupByTypes,
  ): Promise<any[]> {
    return (
      await this.orgStatisticFeedService.getOrderStatisticsInTimeRangeGroupBy({
        orgId: user.currentOrgId,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        groupBy,
      })
    ).map(toLocalStatictis);
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_ORG_STATISTICS_LOG)
  @UseGuards(GqlAuthGuard)
  async feedCategoryStatistics(
    @CurrentUser() user: GuardUserPayload,
    @Args('fromDate') fromDate: number,
    @Args('toDate') toDate: number,
    @Args('groupBy') groupBy: StatisticEntryGroupByTypes,
  ): Promise<any[]> {
    return (
      await this.orgStatisticFeedService.getCategoryStatisticsInTimeRangeGroupBy(
        {
          orgId: user.currentOrgId,
          fromDate: new Date(fromDate),
          toDate: new Date(toDate),
          groupBy,
        },
      )
    ).map(toLocalStatictis);
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_ORG_STATISTICS_LOG)
  @UseGuards(GqlAuthGuard)
  async feedItemStatistics(
    @CurrentUser() user: GuardUserPayload,
    @Args('fromDate') fromDate: number,
    @Args('toDate') toDate: number,
    @Args('groupBy') groupBy: StatisticEntryGroupByTypes,
  ): Promise<any[]> {
    return (
      await this.orgStatisticFeedService.getItemStatisticsInTimeRangeGroupBy({
        orgId: user.currentOrgId,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        groupBy,
      })
    ).map(toLocalStatictis);
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_ORG_STATISTICS_LOG)
  @UseGuards(GqlAuthGuard)
  async feedCustomerStatistics(
    @CurrentUser() user: GuardUserPayload,
    @Args('fromDate') fromDate: number,
    @Args('toDate') toDate: number,
    @Args('groupBy') groupBy: StatisticEntryGroupByTypes,
  ): Promise<any[]> {
    return (
      await this.orgStatisticFeedService.getCustomerStatisticsInTimeRangeGroupBy(
        {
          orgId: user.currentOrgId,
          fromDate: new Date(fromDate),
          toDate: new Date(toDate),
          groupBy,
        },
      )
    ).map(toLocalStatictis);
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_ORG_STATISTICS_LOG)
  @UseGuards(GqlAuthGuard)
  async feedTopTenItems(
    @CurrentUser() user: GuardUserPayload,
    @Args('fromDate') fromDate: number,
    @Args('toDate') toDate: number,
    @Args('orderByField') orderByField: string,
  ): Promise<TopItemInTimeRangeModel[]> {
    return await this.orgStatisticFeedService.getTopTenItemInTimeRange({
      orgId: user.currentOrgId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      orderByField,
    });
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_ORG_STATISTICS_LOG)
  @UseGuards(GqlAuthGuard)
  async feedTopTenCategories(
    @CurrentUser() user: GuardUserPayload,
    @Args('fromDate') fromDate: number,
    @Args('toDate') toDate: number,
    @Args('orderByField') orderByField: string,
  ): Promise<TopCategoryInTimeRangeModel[]> {
    return await this.orgStatisticFeedService.getTopTenCategoryInTimeRange({
      orgId: user.currentOrgId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      orderByField,
    });
  }
}
