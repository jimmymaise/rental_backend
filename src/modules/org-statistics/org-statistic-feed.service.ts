import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import {
  OrgDailyOrderStatistics,
  OrgDailyCategoryStatistics,
  OrgDailyItemStatistics,
  OrgDailyCustomerStatistics,
} from '@prisma/client';

@Injectable()
export class OrgStatisticFeedService {
  constructor(private prismaService: PrismaService) {}
}
