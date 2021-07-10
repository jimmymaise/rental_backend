import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import {
  OrgOrderStatistics,
  OrgCategoryStatistics,
  OrgItemStatistics,
  OrgCustomerStatistics,
} from '@prisma/client';

@Injectable()
export class OrgStatisticFeedService {
  constructor(private prismaService: PrismaService) {}
}
