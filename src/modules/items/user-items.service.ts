import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Item, ItemStatus } from '@prisma/client';
import { PaginationDTO } from '../../models';
import { StoragesService } from '../storages/storages.service'
import { ItemUserInputDTO } from './item-user-input.dto';

@Injectable()
export class UserItemsService {
  constructor(
    private prismaService: PrismaService,
    private storageService: StoragesService
  ) {}

  async findAllItemsCreatedByUser({
    createdBy,
    searchValue = '',
    offset = 0,
    limit = 10,
    includes,
  }): Promise<PaginationDTO<Item>> {
    const mandatoryWhere = {
      isDeleted: false,
      status: {
        not: ItemStatus.Blocked,
      },
      ownerUserId: createdBy,
    };

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
        };

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
      limit,
    };
  }

  async findOneDetailForEdit(
    id: string,
    createdBy: string,
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
      id
    };

    const findCondition: any = {
      where,
    };

    if (Object.keys(include).length) {
      findCondition.include = include;
    }

    const item = await this.prismaService.item.findOne(findCondition);

    if (item && (item.isDeleted || item.status === ItemStatus.Blocked || item.ownerUserId !== createdBy)) {
      return null
    }

    return item;
  }

  async updateMyItem(id: string, createdBy: string, data: ItemUserInputDTO): Promise<Item> {
    const allowUpdateFields = [
      'name',
      'description',
      'categories',
      'images',
      'checkBeforeRentDocuments',
      'keepWhileRentingDocuments',
      'unavailableForRentDays',
      'currentOriginalPrice',
      'sellPrice',
      'rentPricePerDay',
      'rentPricePerWeek',
      'rentPricePerMonth',
      'totalQuantity',
      'status',
      'keyword'
    ];
    const updateData: any = {}

    for (let i = 0; i < allowUpdateFields.length; i++) {
      let field = allowUpdateFields[i]

      switch (field) {
        case 'name':
          if (data[field] && data[field].length) {
            updateData[field] = data[field]
          }
          break
        case 'description':
          if (data[field] && data[field].length) {
            updateData[field] = data[field]
          }
          break
        case 'images':
          if (data[field] && Array.isArray(data[field])) {
            const images: any = data[field]
            images.forEach((image) => {
              this.storageService.handleUploadImageBySignedUrlComplete(image.id, ['small', 'medium'])
            })
            updateData[field] = JSON.stringify(images)
          }
          break
        case 'checkBeforeRentDocuments':
        case 'keepWhileRentingDocuments':
          updateData[field] = JSON.stringify(data[field])
          break
        case 'unavailableForRentDays':
          if (data[field] && data[field].length) {
            const unavailableForRentDays = data[field]
            updateData[field] = (unavailableForRentDays || []).map(
              (data) => new Date(data),
            )
          }
        case 'status':
          if (data[field] && (data[field] === ItemStatus.Draft || (data[field] === ItemStatus.Published))) {
            updateData[field] = data[field]
          }
          break
        default:
          updateData[field] = data[field]
          break
      }
    }

    const where = {
      id
    }
    const foundItem = await this.prismaService.item.findOne({ where })
    if (foundItem && (foundItem.isDeleted || foundItem.status === ItemStatus.Blocked || foundItem.ownerUserId !== createdBy)) {
      return null
    }

    return this.prismaService.item.update({
      where,
      data: updateData
    })
  }

  async softDeleteMyItem(id: string, createdBy: string): Promise<Item> {
    const where = {
      id
    }
    const foundItem = await this.prismaService.item.findOne({ where })
    if (foundItem && (foundItem.isDeleted || foundItem.status === ItemStatus.Blocked || foundItem.ownerUserId !== createdBy)) {
      return null
    }

    return this.prismaService.item.update({
      where,
      data: {
        isDeleted: true
      }
    })
  }
}
