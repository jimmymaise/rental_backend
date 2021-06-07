import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { OrgCategory } from '@prisma/client';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { stringToSlug } from '../../helpers/common';

@Injectable()
export class OrgCategoriesService {
  constructor(
    private prismaService: PrismaService,
    private redisCacheService: RedisCacheService,
  ) {}

  getCategoryListCacheKey(orgId: string) {
    return `CATEGORY_LIST_${orgId}`;
  }

  async findAll(orgId: string): Promise<OrgCategory[]> {
    return this.prismaService.orgCategory.findMany({
      where: { orgId },
      orderBy: { order: 'asc' },
    });
  }

  async findAllAvailable(orgId: string): Promise<OrgCategory[]> {
    const cachedKey = this.getCategoryListCacheKey(orgId);

    let result = (await this.redisCacheService.get(cachedKey)) as OrgCategory[];

    if (!result) {
      result = await this.prismaService.orgCategory.findMany({
        where: { isDisabled: false, orgId },
        orderBy: { order: 'asc' },
      });

      const ONE_DAY = 86400;
      await this.redisCacheService.set(cachedKey, result, ONE_DAY);
    }

    return result;
  }

  async create(orgId: string, data: OrgCategory): Promise<OrgCategory> {
    const cachedKey = this.getCategoryListCacheKey(orgId);
    this.redisCacheService.del(cachedKey);

    const slug = data.slug || stringToSlug(data.name);
    return this.prismaService.orgCategory.create({
      data: {
        ...data,
        slug,
        org: {
          connect: {
            id: orgId,
          },
        },
      },
    } as any);
  }

  async getDetail(id: string): Promise<OrgCategory> {
    return await this.prismaService.orgCategory.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: string,
    orgId: string,
    data: OrgCategory,
  ): Promise<OrgCategory> {
    const cachedKey = this.getCategoryListCacheKey(orgId);
    this.redisCacheService.del(cachedKey);

    const slug = data.slug || stringToSlug(data.name);
    const detail = await this.getDetail(id);
    if (detail.orgId !== orgId) {
      throw new Error('Org Category Not Exist');
    }

    return this.prismaService.orgCategory.update({
      data: {
        ...data,
        slug,
      },
      where: {
        id,
      },
    });
  }

  async delete(id: string, orgId: string): Promise<OrgCategory> {
    const cachedKey = this.getCategoryListCacheKey(orgId);
    this.redisCacheService.del(cachedKey);

    const detail = await this.getDetail(id);
    if (detail.orgId !== orgId) {
      throw new Error('Org Category Not Exist');
    }
    return this.prismaService.orgCategory.delete({
      where: {
        id,
      },
    });
  }
}
