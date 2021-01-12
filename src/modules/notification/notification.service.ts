import { Injectable } from '@nestjs/common';
import { UserNotification, UserNotificationType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { PaginationDTO } from '../../models';
import { NotificationDTO } from './notification.dto';
import { RequestDataNotificationModel } from './models/request-data-notification.model';
import { UsersService } from '../users/users.service';

export function toNotificationDTO(data: UserNotification): NotificationDTO {
  return {
    id: data.id,
    forUserId: data.forUserId,
    data: data.data ? JSON.parse(data.data) : null,
    type: data.type,
    isRead: data.isRead,
    createdDate: data.createdDate.getTime(),
  };
}

@Injectable()
export class NotificationService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
  ) {}

  newRequestToUserNotification(
    forUserId: string,
    data: RequestDataNotificationModel,
  ): Promise<UserNotification> {
    return this.createNewNotification({
      forUserId,
      data,
      type: UserNotificationType.RentingRequestIsCreated,
    });
  }

  private createNewNotification(
    data: NotificationDTO,
  ): Promise<UserNotification> {
    return this.prismaService.userNotification.create({
      data: {
        forUser: {
          connect: {
            id: data.forUserId,
          },
        },
        data: JSON.stringify(data.data),
        type: data.type,
      },
    });
  }

  async findAllMyNotifications({
    offset = 0,
    limit = 10,
    userId,
  }): Promise<PaginationDTO<NotificationDTO>> {
    const items = await this.prismaService.userNotification.findMany({
      where: {
        forUserId: userId,
      },
      skip: offset,
      take: limit,
      orderBy: {
        createdDate: 'desc',
      },
    });

    const count = await this.prismaService.userNotification.count({
      where: {
        forUserId: userId,
      },
    });

    const newItems = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const newItem = toNotificationDTO(item);

      if (item.type === UserNotificationType.RentingRequestIsCreated) {
        const userInfo = await this.usersService.getUserDetailData(
          newItem.data.ownerRequestId,
        );
        newItem.data.ownerRequestUserInfo = {
          avatarImage: {
            url: userInfo.avatarImage?.url,
          },
          displayName: userInfo.displayName,
        };
      }

      newItems.push(newItem);
    }

    return {
      items: newItems,
      total: count,
      offset,
      limit,
    };
  }
}
