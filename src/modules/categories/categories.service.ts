import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';
import { RedisCacheService } from '../redis-cache/redis-cache.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prismaService: PrismaService,
    private redisCacheService: RedisCacheService,
  ) {}

  async findAllAvailable(isFeatured: boolean = null): Promise<Category[]> {
    let key = 'CATEGORY_LIST';

    if (isFeatured !== null) {
      key = 'CATEGORY_LIST_FEATURED';
    }

    let result = await this.redisCacheService.get(key);

    if (!result) {
      if (isFeatured !== null) {
        result = await this.prismaService.category.findMany({
          where: { isDeleted: false, isDisabled: false, isFeatured: true },
          orderBy: { order: 'asc' },
        });
      } else {
        result = await this.prismaService.category.findMany({
          where: { isDeleted: false, isDisabled: false },
          orderBy: { order: 'asc' },
        });
      }

      const ONE_DAY = 86400;
      await this.redisCacheService.set(key, result, ONE_DAY);
    }

    return result;
  }

  findAllAvailableInCategory(parentCategoryId: string): Promise<Category[]> {
    return this.prismaService.category.findMany({
      where: { isDeleted: false, isDisabled: false, parentCategoryId },
      orderBy: { order: 'asc' },
    });
  }
}
