import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import {
  OrgDailyOrderStatistics,
  OrgDailyCategoryStatistics,
  OrgDailyItemStatistics,
  OrgDailyCustomerTradeCountStatistics,
} from '@prisma/client';

@Injectable()
export class OrgStatisticLogService {
  constructor(private prismaService: PrismaService) {}

  private startOfToday(): Date {
    const date = new Date();

    date.setHours(0, 0, 0, 0);

    return date;
  }

  public async increaseTodayOrderAmount(
    orgId: string,
    amount: number,
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
        rentingOrderAmount: amount,
      },
      update: {
        rentingOrderAmount: {
          increment: amount,
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
}
