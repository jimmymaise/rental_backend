import { Injectable } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
import { Base64 } from 'js-base64';

import { PrismaService } from '../prisma/prisma.service';
import { Item, ItemStatus } from '@prisma/client';
import { ItemUserInputDTO } from './item-user-input.dto';
import { stringToSlug } from '../../helpers/common';
import { OffsetPaginationDTO } from '../../models';
import { StoragesService } from '../storages/storages.service';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { OffsetPagingHandler } from '@helpers/handlers/offset-paging-handler';
import { ItemDTO } from '@modules/items/item.dto';

@Injectable()
export class ItemsService {
  constructor(
    private prismaService: PrismaService,
    private storageService: StoragesService,
    private redisCacheService: RedisCacheService,
  ) {}

  // findAllAvailable(isFeatured: boolean): Promise<Item[]> {
  //   if (isFeatured !== null) {
  //     return this.prismaService.category.findMany({ where: { isDeleted: false, isDisabled: false, isFeatured } })
  //   }

  //   return this.prismaService.category.findMany({ where: { isDeleted: false, isDisabled: false } })
  // }

  // findAllAvailableInCategory(parentCategoryId: string): Promise<Category[]> {
  //   return this.prismaService.category.findMany({ where: { isDeleted: false, isDisabled: false, parentCategoryId } })
  // }

  async createItemForUser(
    itemData: ItemUserInputDTO,
    userId: string,
    include: any,
    orgId?: string,
  ): Promise<Item> {
    const {
      sku,
      name,
      description,
      termAndCondition,
      categoryIds,
      areaIds,
      images,
      checkBeforeRentDocuments,
      keepWhileRentingDocuments,
      unavailableForRentDays,
      currentOriginalPrice,
      sellPrice,
      hidePrice,
      rentPricePerDay,
      rentPricePerMonth,
      rentPricePerWeek,
      note,
    } = itemData;

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      await this.storageService.handleUploadImageBySignedUrlComplete(
        image.id,
        ['small', 'medium'],
        true,
      );
    }

    const actualName = sanitizeHtml(name);
    const slug = stringToSlug(actualName);
    const createData: any = {
      data: {
        sku,
        name: actualName,
        slug: slug.replace(/[^a-z0-9\-]/g, '-').replace(/-+/g, '-'),
        description:
          description && typeof description === 'object'
            ? description
            : sanitizeHtml(description),
        termAndCondition:
          termAndCondition && typeof termAndCondition === 'object'
            ? termAndCondition
            : sanitizeHtml(termAndCondition),
        images: images,
        checkBeforeRentDocuments: checkBeforeRentDocuments,
        keepWhileRentingDocuments: keepWhileRentingDocuments,
        unavailableForRentDays: (unavailableForRentDays || []).map(
          (data) => new Date(data),
        ),
        currentOriginalPrice,
        sellPrice,
        hidePrice,
        rentPricePerDay,
        rentPricePerWeek,
        rentPricePerMonth,
        note,
        status: ItemStatus.Published,
        ownerUser: {
          connect: {
            id: userId,
          },
        },
        updatedBy: userId,
        isVerified: process.env.NODE_ENV === 'production' ? false : true,
        keyword: `${actualName} ${slug}`,
      },
      include: include,
    };

    if (categoryIds && categoryIds?.length) {
      createData['categories'] = {
        connect: categoryIds.map((id) => ({ id })),
      };
    }

    if (areaIds && areaIds?.length) {
      createData['areas'] = {
        connect: areaIds.map((id) => ({ id })),
      };
    }

    if (orgId) {
      createData['data']['org'] = {
        connect: {
          id: orgId,
        },
      };
    }

    return this.prismaService.item.create(createData);
  }

  async findAllAvailablesItem({
    searchValue = '',
    offset = 0,
    limit = 10,
    areaId,
    categoryId,
    includes,
    sortByFields,
  }): Promise<OffsetPaginationDTO<Item>> {
    let cacheKey;
    if (offset === 0) {
      // Enabled Cache for only first page
      const hash = `${searchValue}_${offset}_${limit}_${areaId}_${categoryId}_${(
        includes || []
      ).join('|')}_${sortByFields.join('|')}`;
      cacheKey = `ITEMS_LIST_${Base64.encode(hash)}`;

      const cachedResult = await this.redisCacheService.get(cacheKey);
      if (cachedResult) {
        return cachedResult as any;
      }
    }

    const mandatoryWhere = {
      status: ItemStatus.Published,
      isDeleted: false,
      isVerified: true,
    };

    const areaCategoryWhere: any = {};
    if (areaId) {
      areaCategoryWhere.areas = {
        some: {
          id: areaId,
        },
      };
    }

    if (categoryId) {
      areaCategoryWhere.categories = {
        some: {
          id: categoryId,
        },
      };
    }

    const validIncludeMap = {
      categories: true,
      areas: true,
    };

    const include = (includes || []).reduce((result, cur) => {
      if (validIncludeMap[cur]) {
        result[cur] = true;
      }
      return result;
    }, {});

    const where = searchValue
      ? {
          AND: [
            {
              ...mandatoryWhere,
              ...areaCategoryWhere,
            },
            {
              keyword: { contains: searchValue, mode: 'insensitive' },
            },
          ],
        }
      : {
          ...mandatoryWhere,
          ...areaCategoryWhere,
        };

    const findCondition: any = {
      where,
      skip: offset,
      take: limit,
    };

    const validSortBy = {
      rentPricePerDay: true,
      createdDate: true,
      updatedDate: true,
    };

    if (sortByFields && sortByFields.length) {
      sortByFields.forEach((sortBy) => {
        const sortByChunk = sortBy.split(':');
        if (validSortBy[sortByChunk[0]]) {
          findCondition.orderBy = [
            {
              [sortByChunk[0]]: sortByChunk[1] || 'asc',
            },
          ];
        }
      });
    } else {
      findCondition.orderBy = [
        {
          createdDate: 'desc',
        },
      ];
    }

    if (Object.keys(include).length) {
      findCondition.include = include;
    }

    const items = await this.prismaService.item.findMany(findCondition);
    const count = await this.prismaService.item.count({
      where: findCondition.where,
    });

    const result = {
      items,
      total: count,
      offset,
      limit,
    };

    if (cacheKey) {
      const ONE_HOUR = 3600;
      await this.redisCacheService.set(cacheKey, result, ONE_HOUR);
    }

    return result;
  }

  async findOne(uuid: string, includes?: string[]): Promise<Item> {
    const validIncludeMap = {
      categories: true,
      areas: true,
    };

    const include = (includes || []).reduce((result, cur) => {
      if (validIncludeMap[cur]) {
        result[cur] = true;
      }
      return result;
    }, {});

    const where = {
      id: uuid,
    };

    const findCondition: any = {
      where,
    };

    if (Object.keys(include).length) {
      findCondition.include = include;
    }

    const item = await this.prismaService.item.findUnique(findCondition);

    if (!item || item.isDeleted || item.status !== ItemStatus.Published) {
      return null;
    }

    return item;
  }

  async findOneByPID(pid: number, includes?: string[]): Promise<Item> {
    const validIncludeMap = {
      categories: true,
      areas: true,
    };

    const include = (includes || []).reduce((result, cur) => {
      if (validIncludeMap[cur]) {
        result[cur] = true;
      }
      return result;
    }, {});

    const where = {
      pid,
    };

    const findCondition: any = {
      where,
    };

    if (Object.keys(include).length) {
      findCondition.include = include;
    }

    const item = await this.prismaService.item.findUnique(findCondition);

    if (!item || item.isDeleted || item.status !== ItemStatus.Published) {
      return null;
    }

    return item;
  }

  async getAllItemsByOrgIdWithOffsetPaging({
    searchValue,
    orgId,
    pageSize,
    offset,
    orderBy,
    include,
  }: {
    searchValue?: string;
    orgId: string;
    pageSize: number;
    offset?: number;
    orderBy?: string;
    include?: any;
  }): Promise<OffsetPaginationDTO<ItemDTO>> {
    const whereQuery = {
      orgId: orgId,
      isDeleted: false,
    };

    if (searchValue?.length) {
      whereQuery['keyword'] = { contains: searchValue, mode: 'insensitive' };
    }

    return this.getAllItemsWithOffsetPaging(
      whereQuery,
      pageSize,
      offset,
      orderBy,
      include,
    );
  }

  async getAllItemsWithOffsetPaging(
    whereQuery: any,
    pageSize: number,
    offset?: any,
    orderBy: any = { id: 'desc' },
    include?: any,
  ): Promise<OffsetPaginationDTO<ItemDTO>> {
    const pagingHandler = new OffsetPagingHandler(
      whereQuery,
      pageSize,
      orderBy,
      this.prismaService,
      'item',
      include,
    );
    return pagingHandler.getPage(offset);
  }
}
