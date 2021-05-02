import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Item, ItemStatus } from '@prisma/client';
import { OffsetPaginationDTO } from '@app/models';

@Injectable()
export class AdminItemsService {
  constructor(private prismaService: PrismaService) {}

  async findAllItems({
    searchValue = '',
    offset = 0,
    limit = 10,
    areaId,
    categoryId,
    includes,
    sortByFields,
  }): Promise<OffsetPaginationDTO<Item>> {
    const mandatoryWhere = {
      isDeleted: false,
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
      name: 'name',
      rentPricePerDay: 'rentPricePerDay',
      status: 'status',
      isVerified: 'isVerified',
      createdBy: 'ownerUserId',
      createdDate: 'createdDate',
      updatedDate: 'updatedDate',
    };

    if (sortByFields && sortByFields.length) {
      sortByFields.forEach((sortBy) => {
        const sortByChunk = sortBy.split(':');
        const sortKey = validSortBy[sortByChunk[0]];
        if (sortKey) {
          findCondition.orderBy = [
            {
              [sortKey]: sortByChunk[1] || 'asc',
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

    return {
      items,
      total: count,
      offset,
      limit,
    };
  }

  changeStatus(uuid: string, newStatus: ItemStatus): Promise<Item> {
    return this.prismaService.item.update({
      where: {
        id: uuid,
      },
      data: {
        status: newStatus,
      },
    });
  }

  changeVerifyStatus(uuid: string, isVerified: boolean): Promise<Item> {
    return this.prismaService.item.update({
      where: {
        id: uuid,
      },
      data: {
        isVerified,
      },
    });
  }
}
