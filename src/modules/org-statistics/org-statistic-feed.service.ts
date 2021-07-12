import { Injectable } from '@nestjs/common';
import moment from 'moment';

import { PrismaService } from '../prisma/prisma.service';
import { StatisticEntryGroupByTypes, timeRangesInSeconds } from './constants';
import {
  OrgOrderStatistics,
  OrgCategoryStatistics,
  OrgItemStatistics,
  OrgCustomerStatistics,
} from '@prisma/client';
import { TopItemInTimeRangeModel, TopCategoryInTimeRangeModel } from './models';

@Injectable()
export class OrgStatisticFeedService {
  constructor(private prismaService: PrismaService) {}

  private groupStatisticsBy(
    data: any[],
    sumFields: string[],
    groupBy: StatisticEntryGroupByTypes,
    uniqueBy: string[] = [],
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

      uniqueBy.forEach((extraField) => {
        key += `_${item[extraField]}`;
      });

      if (mapData[key]) {
        sumFields.forEach((field) => {
          mapData[key][field] += item[field] || 0;
        });
      } else {
        itemOrders.push(key);
        mapData[key] = { ...item };
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

  // Order
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
        'rentingReturnedOrderCount',
        'rentingCancelledOrderCount',
      ],
      groupBy,
    );
  }

  // Item
  public async getItemStatisticsInTimeRange({
    orgId,
    fromDate,
    toDate,
  }: {
    orgId: string;
    fromDate: Date;
    toDate: Date;
  }): Promise<OrgItemStatistics[]> {
    return this.getStatisticsInTimeRange({
      tableName: 'orgItemStatistics',
      orgId,
      fromDate,
      toDate,
    });
  }

  public async getItemStatisticsInTimeRangeGroupBy({
    orgId,
    fromDate,
    toDate,
    groupBy,
  }: {
    orgId: string;
    fromDate: Date;
    toDate: Date;
    groupBy: StatisticEntryGroupByTypes;
  }): Promise<OrgItemStatistics[]> {
    const dbData = await this.getItemStatisticsInTimeRange({
      orgId,
      fromDate,
      toDate,
    });
    return this.groupStatisticsBy(
      dbData,
      [
        'newRentingOrderCount',
        'cancelledRentingOrderCount',
        'viewCount',
        'amount',
        'payDamagesAmount',
        'refundDamagesAmount',
      ],
      groupBy,
    );
  }

  // Category
  public async getCategoryStatisticsInTimeRange({
    orgId,
    fromDate,
    toDate,
  }: {
    orgId: string;
    fromDate: Date;
    toDate: Date;
  }): Promise<OrgCategoryStatistics[]> {
    return this.getStatisticsInTimeRange({
      tableName: 'orgCategoryStatistics',
      orgId,
      fromDate,
      toDate,
    });
  }

  public async getCategoryStatisticsInTimeRangeGroupBy({
    orgId,
    fromDate,
    toDate,
    groupBy,
  }: {
    orgId: string;
    fromDate: Date;
    toDate: Date;
    groupBy: StatisticEntryGroupByTypes;
  }): Promise<OrgCategoryStatistics[]> {
    const dbData = await this.getCategoryStatisticsInTimeRange({
      orgId,
      fromDate,
      toDate,
    });
    return this.groupStatisticsBy(
      dbData,
      [
        'newRentingOrderCount',
        'cancelledRentingOrderCount',
        'viewCount',
        'amout',
      ],
      groupBy,
      ['orgCategoryId'],
    );
  }

  // Customer
  public async getCustomerStatisticsInTimeRange({
    orgId,
    fromDate,
    toDate,
  }: {
    orgId: string;
    fromDate: Date;
    toDate: Date;
  }): Promise<OrgCustomerStatistics[]> {
    return this.getStatisticsInTimeRange({
      tableName: 'orgCustomerStatistics',
      orgId,
      fromDate,
      toDate,
    });
  }

  public async getCustomerStatisticsInTimeRangeGroupBy({
    orgId,
    fromDate,
    toDate,
    groupBy,
  }: {
    orgId: string;
    fromDate: Date;
    toDate: Date;
    groupBy: StatisticEntryGroupByTypes;
  }): Promise<OrgCustomerStatistics[]> {
    const dbData = await this.getCustomerStatisticsInTimeRange({
      orgId,
      fromDate,
      toDate,
    });
    return this.groupStatisticsBy(dbData, ['newCount', 'returnCount'], groupBy);
  }

  public async getTopTenItemInTimeRange({
    orgId,
    fromDate,
    toDate,
    orderByField,
  }: {
    orgId: string;
    fromDate: Date;
    toDate: Date;
    orderByField: string;
  }): Promise<TopItemInTimeRangeModel[]> {
    const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
    return this.prismaService.$queryRaw(`
      SELECT item_list."id", item_list."pid", item_list."name", item_list."images", item_list."slug", item_list."sku", "newRentingOrderCount",
        "cancelledRentingOrderCount", "viewCount", "amount", "payDamagesAmount", "refundDamagesAmount", "returnedRentingOrderCount"
        FROM (SELECT "itemId",
          SUM("newRentingOrderCount") as "newRentingOrderCount",	
          SUM("cancelledRentingOrderCount") as "cancelledRentingOrderCount",
          SUM("viewCount") as "viewCount", 
          SUM("amount") as "amount", 
          SUM("payDamagesAmount") as "payDamagesAmount", 
          SUM("refundDamagesAmount") as "refundDamagesAmount", 
          SUM("returnedRentingOrderCount") as "returnedRentingOrderCount"
      
        FROM public."OrgItemStatistics" as org_item_statistics
        WHERE org_item_statistics."orgId" = '${orgId}' 
            AND "entryDateTime" between '${moment(fromDate).format(
              DATE_FORMAT,
            )}' AND '${moment(toDate).format(DATE_FORMAT)}'
        GROUP BY org_item_statistics."itemId"
        ORDER BY "${orderByField}" desc) AS grouped_org_item_statistics
      LEFT JOIN public."Item" AS item_list on grouped_org_item_statistics."itemId" = "id"
      WHERE item_list."isDeleted" IS FALSE AND "${orderByField}" > 0
      LIMIT 10
    `);
  }

  public async getTopTenCategoryInTimeRange({
    orgId,
    fromDate,
    toDate,
    orderByField,
  }: {
    orgId: string;
    fromDate: Date;
    toDate: Date;
    orderByField: string;
  }): Promise<TopCategoryInTimeRangeModel[]> {
    const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
    return this.prismaService.$queryRaw(`
      SELECT category_list."id", category_list."name", category_list."slug", "newRentingOrderCount",
        "cancelledRentingOrderCount", "viewCount", "amount", "returnedRentingOrderCount"
      FROM (SELECT "orgCategoryId",
        SUM("newRentingOrderCount") as "newRentingOrderCount",
        SUM("cancelledRentingOrderCount") as "cancelledRentingOrderCount",
        SUM("viewCount") as "viewCount",
        SUM("amount") as "amount",
        SUM("returnedRentingOrderCount") as "returnedRentingOrderCount"
      FROM public."OrgCategoryStatistics" as org_category_statistics
      WHERE org_category_statistics."orgId" = '${orgId}' 
            AND "entryDateTime" between '${moment(fromDate).format(
              DATE_FORMAT,
            )}' AND '${moment(toDate).format(DATE_FORMAT)}'
      GROUP BY org_category_statistics."orgCategoryId"
      ORDER BY "${orderByField}" desc) AS grouped_org_category_statistics
      LEFT JOIN public."OrgCategory" AS category_list on grouped_org_category_statistics."orgCategoryId" = "id"
      WHERE category_list."isDisabled" IS FALSE AND "${orderByField}" > 0
      LIMIT 10
    `);
  }
}
