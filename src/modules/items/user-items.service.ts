import { Injectable } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';

import { PrismaService } from '../prisma/prisma.service';
import { Item } from '@prisma/client';
import { OffsetPaginationDTO, ItemStatus } from '../../models';
import { StoragesService } from '../storages/storages.service';
import { ItemUserInputDTO } from './item-user-input.dto';
import { stringToSlug } from '../../helpers/common';

@Injectable()
export class UserItemsService {
  constructor(
    private prismaService: PrismaService,
    private storageService: StoragesService,
  ) {}

  async findAllItemsCreatedByUser({
    createdBy,
    searchValue = '',
    offset = 0,
    limit = 10,
    includes,
  }): Promise<OffsetPaginationDTO<Item>> {
    const mandatoryWhere = {
      isDeleted: false,
      status: {
        not: ItemStatus.Blocked,
      },
      ownerUserId: createdBy,
    };

    const validIncludeMap = {
      orgCategories: true,
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
            },
            {
              OR: [{ keyword: { contains: searchValue, mode: 'insensitive' } }],
            },
          ],
        }
      : {
          ...mandatoryWhere,
        };

    const findCondition: any = {
      where,
      skip: offset,
      take: limit,
      orderBy: [
        {
          updatedDate: 'desc',
        },
      ],
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
      limit,
    };
  }

  async findAllPublicItemsCreatedByUser({
    createdBy,
    searchValue = '',
    offset = 0,
    limit = 10,
    includes,
  }): Promise<OffsetPaginationDTO<Item>> {
    const mandatoryWhere = {
      isDeleted: false,
      status: ItemStatus.Published,
      ownerUserId: createdBy,
      isVerified: true,
    };

    const validIncludeMap = {
      orgCategories: true,
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
            },
            {
              OR: [{ keyword: { contains: searchValue, mode: 'insensitive' } }],
            },
          ],
        }
      : {
          ...mandatoryWhere,
        };

    const findCondition: any = {
      where,
      skip: offset,
      take: limit,
      orderBy: {
        updatedDate: 'desc',
      },
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
      limit,
    };
  }

  async findOneDetailForEdit(
    id: string,
    createdBy: string,
    includes?: string[],
  ): Promise<Item> {
    const validIncludeMap = {
      orgCategories: true,
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
      id,
    };

    const findCondition: any = {
      where,
    };

    if (Object.keys(include).length) {
      findCondition.include = include;
    }

    const item = await this.prismaService.item.findUnique(findCondition);

    if (
      item &&
      (item.isDeleted ||
        item.status === ItemStatus.Blocked ||
        item.ownerUserId !== createdBy)
    ) {
      return null;
    }

    return item;
  }

  async updateMyItem(
    id: string,
    createdBy: string,
    data: ItemUserInputDTO,
  ): Promise<Item> {
    const allowUpdateFields = [
      'sku',
      'name',
      'description',
      'areaIds',
      'categories',
      'orgCategories',
      'termAndCondition',
      'images',
      'checkBeforeRentDocuments',
      'keepWhileRentingDocuments',
      'unavailableForRentDays',
      'currentOriginalPrice',
      'sellPrice',
      'hidePrice',
      'rentPricePerDay',
      'rentPricePerWeek',
      'rentPricePerMonth',
      'totalQuantity',
      'status',
    ];
    const updateData: any = {};
    const where = {
      id,
    };
    const foundItem = await this.prismaService.item.findUnique({ where });

    for (let i = 0; i < allowUpdateFields.length; i++) {
      const field = allowUpdateFields[i];
      const isVerified = process.env.NODE_ENV === 'production' ? false : true;

      switch (field) {
        case 'name':
          if (
            data[field] &&
            data[field].length &&
            data[field] !== foundItem.name
          ) {
            const actualName = sanitizeHtml(data[field]);
            const slug = stringToSlug(actualName);
            updateData[field] = actualName;
            updateData['slug'] = slug
              .replace(/[^a-z0-9\-]/g, '-')
              .replace(/-+/g, '-');
            updateData['keyword'] = `${actualName} ${slug}`;
            updateData['isVerified'] = isVerified;
          }
          break;
        case 'termAndCondition':
        case 'description':
          if (data[field]) {
            if (typeof data[field] === 'string') {
              updateData[field] = data[field];
            } else {
              updateData[field] = data[field];
            }
            if (updateData[field] !== foundItem[field]) {
              updateData['isVerified'] = isVerified;
            }
          }
          break;
        case 'areaIds':
          const newAreaIds = data['areaIds'] || [];
          updateData['areas'] = {
            set: newAreaIds.map((areaId) => ({
              id: areaId,
            })),
          };
          break;
        case 'images':
          if (data[field] && Array.isArray(data[field])) {
            const images: any = data[field];
            images.forEach((image) => {
              this.storageService.handleUploadImageBySignedUrlComplete(
                image.id,
                ['small', 'medium'],
                true,
              );
            });
            updateData[field] = images;
            if (updateData[field] !== foundItem[field]) {
              updateData['isVerified'] = isVerified;
            }
          }
          break;
        case 'checkBeforeRentDocuments':
        case 'keepWhileRentingDocuments':
          updateData[field] = data[field];
          break;
        case 'unavailableForRentDays':
          if (data[field] && data[field].length) {
            const unavailableForRentDays = data[field];
            updateData[field] = (unavailableForRentDays || []).map(
              (data) => new Date(data),
            );
          }
          break;
        case 'status':
          if (
            data[field] &&
            (data[field] === ItemStatus.Draft ||
              data[field] === ItemStatus.Published)
          ) {
            updateData[field] = data[field];
          }
          break;
        default:
          updateData[field] = data[field];
          break;
      }
    }

    if (
      foundItem &&
      (foundItem.isDeleted ||
        foundItem.status === ItemStatus.Blocked ||
        foundItem.ownerUserId !== createdBy)
    ) {
      return null;
    }

    return this.prismaService.item.update({
      where,
      data: updateData,
    });
  }

  async softDeleteMyItem(id: string, createdBy: string): Promise<Item> {
    const where = {
      id,
    };
    const foundItem = await this.prismaService.item.findUnique({ where });
    if (
      foundItem &&
      (foundItem.isDeleted ||
        foundItem.status === ItemStatus.Blocked ||
        foundItem.ownerUserId !== createdBy)
    ) {
      return null;
    }

    return this.prismaService.item.update({
      where,
      data: {
        isDeleted: true,
      },
    });
  }
}
