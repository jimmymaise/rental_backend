import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Area } from '@prisma/client';
import { RedisCacheService } from '../redis-cache/redis-cache.service';

@Injectable()
export class AreasService {
  constructor(
    private prismaService: PrismaService,
    private redisCacheService: RedisCacheService,
  ) {}

  async findAll(isDisabled = false): Promise<any> {
    let key = 'AREA_LIST';

    if (isDisabled) {
      key = 'AREA_LIST_DISABLED';
    }

    let result = (await this.redisCacheService.get(key)) as Area[];
    if (!result) {
      result = await this.prismaService.area.findMany({
        where: { isDeleted: false, isDisabled },
        orderBy: { order: 'asc' },
      });

      const ONE_DAY = 86400;
      await this.redisCacheService.set(key, result, ONE_DAY);
    }

    return result;
  }
}
