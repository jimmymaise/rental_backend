import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { StatisticEntryGroupByTypes, timeRangesInSeconds } from './constants';
import {
  OrgOrderStatistics,
  OrgCategoryStatistics,
  OrgItemStatistics,
  OrgCustomerStatistics,
} from '@prisma/client';

@Injectable()
export class OrgStatisticFeedService {
  constructor(private prismaService: PrismaService) {}

  private groupStatisticsBy(
    data: any[],
    sumFields: string[],
    groupBy: StatisticEntryGroupByTypes,
  ): any[] {
    const itemOrders: string[] = [];
    const mapData = {};

    data.forEach((item) => {
      let key;

      switch (groupBy) {
        case StatisticEntryGroupByTypes.Year:
          key = item.entryDateTime.getFullYear();
          break;
        case StatisticEntryGroupByTypes.Month:
          key = `${item.entryDateTime.getFullYear()}_${item.entryDateTime.getMonth()}`;
          break;
        case StatisticEntryGroupByTypes.Day:
          key = `${item.entryDateTime.getFullYear()}_${item.entryDateTime.getMonth()}_${item.entryDateTime.getDay()}`;
          break;
        case StatisticEntryGroupByTypes.Time:
          const seconds =
            item.entryDateTime.getHours() * 3600 +
            item.entryDateTime.getMinutes() * 60;
          const foundRange = timeRangesInSeconds.find(
            (rangeItem) => seconds >= rangeItem[0] && seconds <= rangeItem[1],
          );
          key = `${item.entryDateTime.getFullYear()}_${item.entryDateTime.getMonth()}_${
            foundRange[0]
          }_${foundRange[1]}`;
          break;
        default:
          break;
      }

      if (mapData[key]) {
        sumFields.forEach((field) => {
          mapData[key][field] += item[field] || 0;
        });
      } else {
        itemOrders.push(key);
        mapData[key] = item;
      }
    });

    return itemOrders.map((key) => mapData[key]);
  }

  private async getStatisticsInTimeRange({
    tableName,
    orgId,
    fromDate,
    toDate,
  }: {
    tableName: string;
    orgId: string;
    fromDate: Date;
    toDate: Date;
  }): Promise<any[]> {
    return this.prismaService[tableName].findMany({
      where: {
        orgId,
        entryDateTime: {
          gte: fromDate,
          lte: toDate,
        },
      },
      orderBy: {
        entryDateTime: 'asc',
      },
    });
  }

  public async getOrderStatisticsInTimeRange({
    orgId,
    fromDate,
    toDate,
  }: {
    orgId: string;
    fromDate: Date;
    toDate: Date;
  }): Promise<OrgOrderStatistics[]> {
    return this.getStatisticsInTimeRange({
      tableName: 'orgOrderStatistics',
      orgId,
      fromDate,
      toDate,
    });
  }

  public async getOrderStatisticsInTimeRangeGroupBy({
    orgId,
    fromDate,
    toDate,
    groupBy,
  }: {
    orgId: string;
    fromDate: Date;
    toDate: Date;
    groupBy: StatisticEntryGroupByTypes;
  }): Promise<OrgOrderStatistics[]> {
    const dbData = await this.getOrderStatisticsInTimeRange({
      orgId,
      fromDate,
      toDate,
    });
    return this.groupStatisticsBy(
      dbData,
      [
        'rentingOrderAmount',
        'rentingOrderPayAmount',
        'rentingOrderRefundAmount',
        'rentingNewOrderCount',
        'rentingReservedOrderCount',
        'rentingPickedUpOrderCount',
        'rentingReturnedUpOrderCount',
        'rentingCancelledOrderCount',
      ],
      groupBy,
    );
  }
}
