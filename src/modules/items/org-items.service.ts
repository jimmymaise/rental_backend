import { Injectable } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';

import { PrismaService } from '../prisma/prisma.service';
import { Item, ItemStatus } from '@prisma/client';
import { StoragesService } from '../storages/storages.service';
import { ItemUserInputDTO } from './item-user-input.dto';
import { stringToSlug } from '../../helpers/common';

@Injectable()
export class OrgItemsService {
  constructor(
    private prismaService: PrismaService,
    private storageService: StoragesService,
  ) {}

  async findDetailForOrg(
    id: string,
    orgId: string,
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
        item.orgId !== orgId)
    ) {
      return null;
    }

    return item;
  }

  async updateOrgItem(
    id: string,
    orgId: string,
    data: ItemUserInputDTO,
  ): Promise<Item> {
    const allowUpdateFields = [
      'sku',
      'name',
      'description',
      'areas',
      'categories',
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
        case 'images':
          if (data[field] && Array.isArray(data[field])) {
            const images: any = data[field];
            images.forEach((image) => {
              this.storageService.handleUploadImageBySignedUrlComplete(
                image.id,
                ['small', 'medium'],
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
        foundItem.orgId !== orgId)
    ) {
      return null;
    }

    return this.prismaService.item.update({
      where,
      data: updateData,
    });
  }

  async softDeleteOrgItem(id: string, orgId: string): Promise<Item> {
    const where = {
      id,
    };
    const foundItem = await this.prismaService.item.findUnique({ where });
    if (
      foundItem &&
      (foundItem.isDeleted ||
        foundItem.status === ItemStatus.Blocked ||
        foundItem.orgId !== orgId)
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
