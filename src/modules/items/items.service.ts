import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Item, ItemStatus } from '@prisma/client';
import { ItemUserInputDTO } from './item-user-input.dto';
import { stringToSlug } from '../../helpers';
import { PaginationDTO } from '../../models';
import { StoragesService } from '../storages/storages.service'

@Injectable()
export class ItemsService {
  constructor(
    private prismaService: PrismaService,
    private storageService: StoragesService
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

  createItem(item: Item): Promise<Item> {
    return this.prismaService.item.create({ data: item });
  }

  createItemForUser(itemData: ItemUserInputDTO, userId: string): Promise<Item> {
    const {
      name,
      description,
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

    images.forEach((image) => {
      this.storageService.handleUploadImageBySignedUrlComplete(image.id, ['small', 'medium'])
    })

    return this.prismaService.item.create({
      data: {
        name,
        slug: `${stringToSlug(name)}-${nowToString.substr(
          nowToString.length - 5,
        )}`,
        description,
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
        ownerUserId: userId,
        updatedBy: userId,
        isVerified: process.env.NODE_ENV === 'production' ? false : true
      },
    });
  }

  async findAllAvailablesItem({
    searchValue = '',
    offset = 0,
    limit = 10,
    areaId,
    categoryId,
    includes,
  }): Promise<PaginationDTO<Item>> {
    const mandatoryWhere = {
      isDeleted: false,
      isVerified: true,
      status: ItemStatus.Published,
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
              OR: [
                { name: { contains: searchValue } },
                { keyword: { contains: searchValue } },
              ],
            },
          ],
        }
      : {
        ...mandatoryWhere,
        ...areaCategoryWhere,
      }

    const findCondition: any = {
      where,
      skip: offset,
      take: limit,
    };

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
      limit
    };
  }

  async findOneAvailableBySlug(slug: string, includes?: string[]): Promise<Item> {
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
      slug
    }

    const findCondition: any = {
      where
    };

    if (Object.keys(include).length) {
      findCondition.include = include;
    }

    const item = await this.prismaService.item.findOne(findCondition);

    if (!item || item.isDeleted || item.status !== ItemStatus.Published) {
      return null
    }

    return item
  }
}
