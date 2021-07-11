import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import {
  OrgOrderStatistics,
  OrgCategoryStatistics,
  OrgItemStatistics,
  OrgCustomerStatistics,
} from '@prisma/client';

@Injectable()
export class OrgStatisticLogService {
  constructor(private prismaService: PrismaService) {}

  private startOfToday(): Date {
    const date = new Date();

    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
  }

  // OrgOrderStatistics
  public async updateOrgOrderStatistics(
    orgId: string,
    {
      field,
      value,
    }: {
      field: string;
      value: number;
    },
  ): Promise<OrgOrderStatistics> {
    const entryDateTime = this.startOfToday();

    return this.prismaService.orgOrderStatistics.upsert({
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

  public async increaseNowOrderAmount(
    orgId: string,
    amount: number,
  ): Promise<OrgOrderStatistics> {
    return this.updateOrgOrderStatistics(orgId, {
      field: 'rentingOrderAmount',
      value: amount,
    });
  }

  public async increaseNowOrderPayAmount(
    orgId: string,
    amount: number,
  ): Promise<OrgOrderStatistics> {
    return this.updateOrgOrderStatistics(orgId, {
      field: 'rentingOrderPayAmount',
      value: amount,
    });
  }

  public async increaseNowOrderRefundAmount(
    orgId: string,
    amount: number,
  ): Promise<OrgOrderStatistics> {
    return this.updateOrgOrderStatistics(orgId, {
      field: 'rentingOrderRefundAmount',
      value: amount,
    });
  }

  public async increaseNowNewOrderCount(
    orgId: string,
  ): Promise<OrgOrderStatistics> {
    return this.updateOrgOrderStatistics(orgId, {
      field: 'rentingNewOrderCount',
      value: 1,
    });
  }

  public async increaseNowReservedOrderCount(
    orgId: string,
  ): Promise<OrgOrderStatistics> {
    return this.updateOrgOrderStatistics(orgId, {
      field: 'rentingReservedOrderCount',
      value: 1,
    });
  }

  public async increaseNowPickedUpOrderCount(
    orgId: string,
  ): Promise<OrgOrderStatistics> {
    return this.updateOrgOrderStatistics(orgId, {
      field: 'rentingPickedUpOrderCount',
      value: 1,
    });
  }

  public async increaseNowReturnedOrderCount(
    orgId: string,
  ): Promise<OrgOrderStatistics> {
    return this.updateOrgOrderStatistics(orgId, {
      field: 'rentingReturnedOrderCount',
      value: 1,
    });
  }

  public async increaseNowCancelledOrderCount(
    orgId: string,
  ): Promise<OrgOrderStatistics> {
    return this.updateOrgOrderStatistics(orgId, {
      field: 'rentingCancelledOrderCount',
      value: 1,
    });
  }

  // OrgCategoryStatistics
  public async updateOrgCategoryStatistics(
    orgId: string,
    categoryId: string,
    {
      field,
      value,
    }: {
      field: string;
      value: number;
    },
  ): Promise<OrgCategoryStatistics> {
    const entryDateTime = this.startOfToday();

    return this.prismaService.orgCategoryStatistics.upsert({
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

  public async increaseNowOrgCategoryNewOrderCount(
    orgId: string,
    categoryId: string,
  ): Promise<OrgCategoryStatistics> {
    return this.updateOrgCategoryStatistics(orgId, categoryId, {
      field: 'newRentingOrderCount',
      value: 1,
    });
  }

  public async increaseNowOrgCategoryCancelledOrderCount(
    orgId: string,
    categoryId: string,
  ): Promise<OrgCategoryStatistics> {
    return this.updateOrgCategoryStatistics(orgId, categoryId, {
      field: 'cancelledRentingOrderCount',
      value: 1,
    });
  }

  //
  public async increaseNowOrgCategoryViewCount(
    orgId: string,
    categoryId: string,
  ): Promise<OrgCategoryStatistics> {
    return this.updateOrgCategoryStatistics(orgId, categoryId, {
      field: 'viewCount',
      value: 1,
    });
  }

  public async increaseNowOrgCategoryAmount(
    orgId: string,
    categoryId: string,
    amount: number,
  ): Promise<OrgCategoryStatistics> {
    return this.updateOrgCategoryStatistics(orgId, categoryId, {
      field: 'amount',
      value: amount,
    });
  }

  // OrgItemStatistics
  public async updateOrgItemStatisticsStatistics(
    orgId: string,
    itemId: string,
    {
      field,
      value,
    }: {
      field: string;
      value: number;
    },
  ): Promise<OrgItemStatistics> {
    const entryDateTime = this.startOfToday();

    return this.prismaService.orgItemStatistics.upsert({
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

  public async increaseNowItemNewOrderCount(
    orgId: string,
    itemId: string,
  ): Promise<OrgItemStatistics> {
    return this.updateOrgItemStatisticsStatistics(orgId, itemId, {
      field: 'newRentingOrderCount',
      value: 1,
    });
  }

  public async increaseNowItemCancelledOrderCount(
    orgId: string,
    itemId: string,
  ): Promise<OrgItemStatistics> {
    return this.updateOrgItemStatisticsStatistics(orgId, itemId, {
      field: 'cancelledRentingOrderCount',
      value: 1,
    });
  }

  //
  public async increaseNowItemViewCount(
    orgId: string,
    itemId: string,
  ): Promise<OrgItemStatistics> {
    return this.updateOrgItemStatisticsStatistics(orgId, itemId, {
      field: 'viewCount',
      value: 1,
    });
  }

  public async increaseNowItemAmount(
    orgId: string,
    itemId: string,
    amount: number,
  ): Promise<OrgItemStatistics> {
    return this.updateOrgItemStatisticsStatistics(orgId, itemId, {
      field: 'amount',
      value: amount,
    });
  }

  public async increaseNowItemPayDamagesAmount(
    orgId: string,
    itemId: string,
    amount: number,
  ): Promise<OrgItemStatistics> {
    return this.updateOrgItemStatisticsStatistics(orgId, itemId, {
      field: 'payDamagesAmount',
      value: amount,
    });
  }

  public async increaseNowItemRefundDamagesAmount(
    orgId: string,
    itemId: string,
    amount: number,
  ): Promise<OrgItemStatistics> {
    return this.updateOrgItemStatisticsStatistics(orgId, itemId, {
      field: 'refundDamagesAmount',
      value: amount,
    });
  }

  // OrgCustomerStatistics
  public async updateOrgCustomerStatistics(
    orgId: string,
    {
      field,
      value,
    }: {
      field: string;
      value: number;
    },
  ): Promise<OrgCustomerStatistics> {
    const entryDateTime = this.startOfToday();

    return this.prismaService.orgCustomerStatistics.upsert({
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

  public async increaseNowNewCustomerCount(
    orgId: string,
  ): Promise<OrgCustomerStatistics> {
    return this.updateOrgCustomerStatistics(orgId, {
      field: 'newCount',
      value: 1,
    });
  }

  public async increaseNowReturnCustomerCount(
    orgId: string,
  ): Promise<OrgCustomerStatistics> {
    return this.updateOrgCustomerStatistics(orgId, {
      field: 'returnCount',
      value: 1,
    });
  }
}
