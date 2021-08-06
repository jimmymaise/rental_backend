import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { OrgCategory } from '@prisma/client';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { stringToSlug } from '../../helpers/common';
import { OrgActivityLogService } from '@modules/org-activity-log/org-activity-log.service';

@Injectable()
export class OrgCategoriesService {
  constructor(
    private prismaService: PrismaService,
    private redisCacheService: RedisCacheService,
    private orgActivityLogService: OrgActivityLogService,
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

  async create({
    orgId,
    data,
    createdBy,
  }: {
    orgId: string;
    data: OrgCategory;
    createdBy: string;
  }): Promise<OrgCategory> {
    const cachedKey = this.getCategoryListCacheKey(orgId);
    this.redisCacheService.del(cachedKey);

    const slug = data.slug
      ? data.slug.replace(' ', '-')
      : stringToSlug(data.name).replace(' ', '-');
    const result = await this.prismaService.orgCategory.create({
      data: {
        ...data,
        slug,
        org: {
          connect: {
            id: orgId,
          },
        },
        createdBy,
        updatedBy: createdBy,
      },
    } as any);

    this.orgActivityLogService.logCreateCategory({
      createdBy,
      data: {
        categoryId: result.id,
        categoryName: result.name,
      },
      orgId,
    });

    return result;
  }

  async getDetail(id: string): Promise<OrgCategory> {
    return await this.prismaService.orgCategory.findUnique({
      where: {
        id,
      },
    });
  }

  async update({
    data,
    id,
    orgId,
    updatedBy,
  }: {
    id: string;
    orgId: string;
    data: OrgCategory;
    updatedBy: string;
  }): Promise<OrgCategory> {
    const cachedKey = this.getCategoryListCacheKey(orgId);
    this.redisCacheService.del(cachedKey);

    const slug = data.slug || stringToSlug(data.name);
    const detail = await this.getDetail(id);
    if (detail.orgId !== orgId) {
      throw new Error('Org Category Not Exist');
    }

    const result = await this.prismaService.orgCategory.update({
      data: {
        ...data,
        slug,
        updatedBy,
      },
      where: {
        id,
      },
    });

    this.orgActivityLogService.logUpdateCategory({
      createdBy: updatedBy,
      data: {
        categoryId: result.id,
        categoryName: result.name,
        updateActions: [],
      },
      orgId,
    });

    return result;
  }

  async delete({
    id,
    orgId,
    updatedBy,
  }: {
    id: string;
    orgId: string;
    updatedBy: string;
  }): Promise<OrgCategory> {
    const cachedKey = this.getCategoryListCacheKey(orgId);
    this.redisCacheService.del(cachedKey);

    const detail = await this.getDetail(id);
    if (detail.orgId !== orgId) {
      throw new Error('Org Category Not Exist');
    }
    const result = await this.prismaService.orgCategory.delete({
      where: {
        id,
      },
    });

    this.orgActivityLogService.logDeleteCategory({
      createdBy: updatedBy,
      data: {
        categoryId: result.id,
        categoryName: result.name,
      },
      orgId,
    });

    return result;
  }
}
