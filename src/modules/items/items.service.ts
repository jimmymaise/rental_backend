import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Item, ItemStatus } from '@prisma/client';
import { ItemUserInputDTO } from './item-user-input.dto';
import { stringToSlug } from '../../helpers';
import { PaginationDTO } from '../../models';
import { StoragesService } from '../storages/storages.service';

@Injectable()
export class ItemsService {
  constructor(
    private prismaService: PrismaService,
    private storageService: StoragesService,
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
    includes: string[]
  ): Promise<Item> {
    const {
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
      rentPricePerDay,
      rentPricePerMonth,
      rentPricePerWeek,
      note,
    } = itemData;
    const nowToString = Date.now().toString();

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      await this.storageService.handleUploadImageBySignedUrlComplete(image.id, [
        'small',
        'medium',
      ]);
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

    const createData: any = {
      data: {
        name,
        slug: `${stringToSlug(name)}-${nowToString.substr(
          nowToString.length - 5,
        )}`,
        description: description ? JSON.stringify(description) : '',
        termAndCondition: termAndCondition
          ? JSON.stringify(termAndCondition)
          : '',
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
        areas: {
          connect: areaIds.map((id) => ({ id })),
        },
        images: JSON.stringify(images),
        checkBeforeRentDocuments: JSON.stringify(checkBeforeRentDocuments),
        keepWhileRentingDocuments: JSON.stringify(keepWhileRentingDocuments),
        unavailableForRentDays: (unavailableForRentDays || []).map(
          (data) => new Date(data),
        ),
        currentOriginalPrice,
        sellPrice,
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
      },
    }

    if (includes.length) {
      createData.include = include
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
  }): Promise<PaginationDTO<Item>> {
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
              keyword: { contains: searchValue },
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

    return {
      items,
      total: count,
      offset,
      limit,
    };
  }

  async findOneAvailableBySlug(
    slug: string,
    includes?: string[],
  ): Promise<Item> {
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
      slug,
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
}
