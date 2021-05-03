import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { RentingItemRequestActivity } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { StoragesService } from '../storages/storages.service';
import { RentingItemRequestActivityDTO } from './renting-item-request-activity.dto';
import { OffsetPaginationDTO } from '../../models';

export function toRentingItemRequestActivityDTO(
  data: RentingItemRequestActivity,
): RentingItemRequestActivityDTO {
  return {
    id: data.id,
    rentingItemRequestId: data.rentingItemRequestId,
    comment: data.comment,
    type: data.type,
    files: data.files as any,
    createdDate: data.createdDate.getTime(),
    updatedDate: data.updatedDate.getTime(),
  };
}

@Injectable()
export class RentingItemRequestActivitiesService {
  constructor(
    private prismaService: PrismaService,
    private userService: UsersService,
    private storageService: StoragesService,
  ) {}

  // TODO: check user owner of this activitiy
  async findAllActivityFromRequest({
    userId,
    offset = 0,
    limit = 10,
    rentingRequestId,
  }): Promise<OffsetPaginationDTO<RentingItemRequestActivityDTO>> {
    const items = await this.prismaService.rentingItemRequestActivity.findMany({
      where: {
        rentingItemRequestId: rentingRequestId,
      },
      orderBy: {
        createdDate: 'desc',
      },
    });
    const count = await this.prismaService.rentingItemRequestActivity.count({
      where: {
        rentingItemRequestId: rentingRequestId,
      },
    });

    const finalItems: RentingItemRequestActivityDTO[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as RentingItemRequestActivity;
      const newItem = toRentingItemRequestActivityDTO(item);

      newItem.createdBy = await this.userService.getUserDetailData(
        item.createdBy,
      );
      newItem.updatedBy = await this.userService.getUserDetailData(
        item.updatedBy,
      );

      for (let j = 0; j < newItem.files.length; j++) {
        newItem.files[
          j
        ].signedUrl = await this.storageService.getReadSignedUrlForUrl(
          newItem.files[j].url,
          ['small', 'medium'],
        );
      }

      finalItems.push(newItem);
    }

    return {
      items: finalItems,
      total: count,
      offset,
      limit,
    };
  }
}
