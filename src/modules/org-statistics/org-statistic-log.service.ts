import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import {
  OrgDailyOrderStatistics,
  OrgDailyCategoryStatistics,
  OrgDailyItemStatistics,
  OrgDailyCustomerStatistics,
} from '@prisma/client';

@Injectable()
export class OrgStatisticLogService {
  constructor(private prismaService: PrismaService) {}

  private startOfToday(): Date {
    const date = new Date();

    date.setSeconds(0);

    return date;
  }

  // OrgDailyOrderStatistics
  public async updateOrgDailyOrderStatistics(
    orgId: string,
    {
      field,
      value,
    }: {
      field: string;
      value: number;
    },
  ): Promise<OrgDailyOrderStatistics> {
    const entryDateTime = this.startOfToday();

    return this.prismaService.orgDailyOrderStatistics.upsert({
      create: {
        entryDateTime,
        org: {
          connect: {
            id: orgId,
          },
        },
        [field]: value,
      },
      update: {
        [field]: {
          increment: value,
        },
      },
      where: {
        orgId_entryDateTime: {
          entryDateTime,
          orgId,
        },
      },
    });
  }

  public async increaseTodayOrderAmount(
    orgId: string,
    amount: number,
  ): Promise<OrgDailyOrderStatistics> {
    return this.updateOrgDailyOrderStatistics(orgId, {
      field: 'rentingOrderAmount',
      value: amount,
    });
  }

  public async increaseTodayOrderPayAmount(
    orgId: string,
    amount: number,
  ): Promise<OrgDailyOrderStatistics> {
    return this.updateOrgDailyOrderStatistics(orgId, {
      field: 'rentingOrderPayAmount',
      value: amount,
    });
  }

  public async increaseTodayOrderRefundAmount(
    orgId: string,
    amount: number,
  ): Promise<OrgDailyOrderStatistics> {
    return this.updateOrgDailyOrderStatistics(orgId, {
      field: 'rentingOrderRefundAmount',
      value: amount,
    });
  }

  public async increaseTodayNewOrderCount(
    orgId: string,
  ): Promise<OrgDailyOrderStatistics> {
    return this.updateOrgDailyOrderStatistics(orgId, {
      field: 'rentingNewOrderCount',
      value: 1,
    });
  }

  public async increaseTodayReservedOrderCount(
    orgId: string,
  ): Promise<OrgDailyOrderStatistics> {
    return this.updateOrgDailyOrderStatistics(orgId, {
      field: 'rentingReservedOrderCount',
      value: 1,
    });
  }

  public async increaseTodayPickedUpOrderCount(
    orgId: string,
  ): Promise<OrgDailyOrderStatistics> {
    return this.updateOrgDailyOrderStatistics(orgId, {
      field: 'rentingPickedUpOrderCount',
      value: 1,
    });
  }

  public async increaseTodayReturnedOrderCount(
    orgId: string,
  ): Promise<OrgDailyOrderStatistics> {
    return this.updateOrgDailyOrderStatistics(orgId, {
      field: 'rentingReturnedUpOrderCount',
      value: 1,
    });
  }

  public async increaseTodayCancelledOrderCount(
    orgId: string,
  ): Promise<OrgDailyOrderStatistics> {
    return this.updateOrgDailyOrderStatistics(orgId, {
      field: 'rentingCancelledOrderCount',
      value: 1,
    });
  }

  // OrgDailyCategoryStatistics
  public async updateOrgDailyCategoryStatistics(
    orgId: string,
    categoryId: string,
    {
      field,
      value,
    }: {
      field: string;
      value: number;
    },
  ): Promise<OrgDailyCategoryStatistics> {
    const entryDateTime = this.startOfToday();

    return this.prismaService.orgDailyCategoryStatistics.upsert({
      create: {
        entryDateTime,
        org: {
          connect: {
            id: orgId,
          },
        },
        orgCategory: {
          connect: {
            id: categoryId,
          },
        },
        [field]: value,
      },
      update: {
        [field]: {
          increment: value,
        },
      },
      where: {
        orgId_entryDateTime_orgCategoryId: {
          entryDateTime,
          orgId,
          orgCategoryId: categoryId,
        },
      },
    });
  }

  public async increaseTodayOrgCategoryNewOrderCount(
    orgId: string,
    categoryId: string,
  ): Promise<OrgDailyCategoryStatistics> {
    return this.updateOrgDailyCategoryStatistics(orgId, categoryId, {
      field: 'newRentingOrderCount',
      value: 1,
    });
  }

  public async increaseTodayOrgCategoryCancelledOrderCount(
    orgId: string,
    categoryId: string,
  ): Promise<OrgDailyCategoryStatistics> {
    return this.updateOrgDailyCategoryStatistics(orgId, categoryId, {
      field: 'cancelledRentingOrderCount',
      value: 1,
    });
  }

  //
  public async increaseTodayOrgCategoryViewCount(
    orgId: string,
    categoryId: string,
  ): Promise<OrgDailyCategoryStatistics> {
    return this.updateOrgDailyCategoryStatistics(orgId, categoryId, {
      field: 'viewCount',
      value: 1,
    });
  }

  public async increaseTodayOrgCategoryAmount(
    orgId: string,
    categoryId: string,
    amount: number,
  ): Promise<OrgDailyCategoryStatistics> {
    return this.updateOrgDailyCategoryStatistics(orgId, categoryId, {
      field: 'amount',
      value: amount,
    });
  }

  // OrgDailyItemStatistics
  public async updateOrgDailyItemStatisticsStatistics(
    orgId: string,
    itemId: string,
    {
      field,
      value,
    }: {
      field: string;
      value: number;
    },
  ): Promise<OrgDailyItemStatistics> {
    const entryDateTime = this.startOfToday();

    return this.prismaService.orgDailyItemStatistics.upsert({
      create: {
        entryDateTime,
        org: {
          connect: {
            id: orgId,
          },
        },
        item: {
          connect: {
            id: itemId,
          },
        },
        [field]: value,
      },
      update: {
        [field]: {
          increment: value,
        },
      },
      where: {
        orgId_entryDateTime_itemId: {
          entryDateTime,
          orgId,
          itemId,
        },
      },
    });
  }

  public async increaseTodayItemNewOrderCount(
    orgId: string,
    itemId: string,
  ): Promise<OrgDailyItemStatistics> {
    return this.updateOrgDailyItemStatisticsStatistics(orgId, itemId, {
      field: 'newRentingOrderCount',
      value: 1,
    });
  }

  public async increaseTodayItemCancelledOrderCount(
    orgId: string,
    itemId: string,
  ): Promise<OrgDailyItemStatistics> {
    return this.updateOrgDailyItemStatisticsStatistics(orgId, itemId, {
      field: 'cancelledRentingOrderCount',
      value: 1,
    });
  }

  //
  public async increaseTodayItemViewCount(
    orgId: string,
    itemId: string,
  ): Promise<OrgDailyItemStatistics> {
    return this.updateOrgDailyItemStatisticsStatistics(orgId, itemId, {
      field: 'viewCount',
      value: 1,
    });
  }

  public async increaseTodayItemAmount(
    orgId: string,
    itemId: string,
    amount: number,
  ): Promise<OrgDailyItemStatistics> {
    return this.updateOrgDailyItemStatisticsStatistics(orgId, itemId, {
      field: 'amount',
      value: amount,
    });
  }

  public async increaseTodayItemPayDamagesAmount(
    orgId: string,
    itemId: string,
    amount: number,
  ): Promise<OrgDailyItemStatistics> {
    return this.updateOrgDailyItemStatisticsStatistics(orgId, itemId, {
      field: 'payDamagesAmount',
      value: amount,
    });
  }

  public async increaseTodayItemRefundDamagesAmount(
    orgId: string,
    itemId: string,
    amount: number,
  ): Promise<OrgDailyItemStatistics> {
    return this.updateOrgDailyItemStatisticsStatistics(orgId, itemId, {
      field: 'refundDamagesAmount',
      value: amount,
    });
  }

  // OrgDailyCustomerStatistics
  public async updateOrgDailyCustomerStatistics(
    orgId: string,
    {
      field,
      value,
    }: {
      field: string;
      value: number;
    },
  ): Promise<OrgDailyCustomerStatistics> {
    const entryDateTime = this.startOfToday();

    return this.prismaService.orgDailyCustomerStatistics.upsert({
      create: {
        entryDateTime,
        org: {
          connect: {
            id: orgId,
          },
        },
        [field]: value,
      },
      update: {
        [field]: {
          increment: value,
        },
      },
      where: {
        orgId_entryDateTime: {
          entryDateTime,
          orgId,
        },
      },
    });
  }

  public async increaseTodayNewCustomerCount(
    orgId: string,
  ): Promise<OrgDailyCustomerStatistics> {
    return this.updateOrgDailyCustomerStatistics(orgId, {
      field: 'newCount',
      value: 1,
    });
  }

  public async increaseTodayReturnCustomerCount(
    orgId: string,
  ): Promise<OrgDailyCustomerStatistics> {
    return this.updateOrgDailyCustomerStatistics(orgId, {
      field: 'returnCount',
      value: 1,
    });
  }
}
