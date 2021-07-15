import { Injectable } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';

import { PrismaService } from '../prisma/prisma.service';
import { Item, ItemStatus } from '@prisma/client';
import { StoragesService } from '../storages/storages.service';
import { ItemUserInputDTO } from './item-user-input.dto';
import { stringToSlug } from '../../helpers/common';
import { OrgActivityLogService } from '@modules/org-activity-log/org-activity-log.service';

@Injectable()
export class OrgItemsService {
  constructor(
    private prismaService: PrismaService,
    private storageService: StoragesService,
    private orgActivityLogService: OrgActivityLogService,
  ) {}

  async findDetailForOrg(
    id: string,
    orgId: string,
    include: any,
  ): Promise<Item> {
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
    updatedBy: string,
    data: ItemUserInputDTO,
  ): Promise<Item> {
    const allowUpdateFields = [
      'sku',
      'name',
      'description',
      'areaIds',
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
      'orgCategoryIds',
    ];
    const updateData: any = {};
    const where = {
      id,
    };
    const foundItem = await this.prismaService.item.findUnique({
      where,
      include: { orgCategories: { select: { id: true } } },
    });

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
        case 'orgCategoryIds':
          const newCategoryIds = data['orgCategoryIds'] || [];
          updateData['orgCategories'] = {
            set: newCategoryIds.map((orgCategoryId) => ({
              id: orgCategoryId,
            })),
          };
          break;
        case 'areaIds':
          const newAreaIds = data['areaIds'] || [];
          updateData['areas'] = {
            set: newAreaIds.map((areaId) => ({
              id: areaId,
            })),
          };
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

    updateData.updatedBy = updatedBy;

    if (
      foundItem &&
      (foundItem.isDeleted ||
        foundItem.status === ItemStatus.Blocked ||
        foundItem.orgId !== orgId)
    ) {
      return null;
    }

    const result = await this.prismaService.item.update({
      where,
      data: updateData,
    });

    await this.orgActivityLogService.logUpdateItem({
      createdBy: result.updatedBy,
      data: {
        itemId: result.id,
        itemName: result.name,
        updateActions: [],
      },
      itemId: result.id,
      orgId,
    });

    return result;
  }

  async softDeleteOrgItem(
    id: string,
    orgId: string,
    deletedBy: string,
  ): Promise<Item> {
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

    const result = await this.prismaService.item.update({
      where,
      data: {
        isDeleted: true,
      },
    });

    await this.orgActivityLogService.logDeleteItem({
      createdBy: deletedBy,
      data: {
        itemId: result.id,
        itemName: result.name,
      },
      itemId: result.id,
      orgId,
    });

    return result;
  }
}
