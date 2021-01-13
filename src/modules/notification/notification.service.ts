import { Injectable } from '@nestjs/common';
import { UserNotification, UserNotificationType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { PaginationDTO } from '../../models';
import { NotificationDTO } from './notification.dto';
import { RequestDataNotificationModel } from './models/request-data-notification.model';
import { UsersService } from '../users/users.service';
import { RENTING_REQUEST_TYPE_SET } from './constants';

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

  cancelRequestToUserNotification(
    forUserId: string,
    data: RequestDataNotificationModel,
  ): Promise<UserNotification> {
    return this.createNewNotification({
      forUserId,
      data,
      type: UserNotificationType.RentingRequestIsCancelled,
    });
  }

  approveRequestToUserNotification(
    forUserId: string,
    data: RequestDataNotificationModel,
  ): Promise<UserNotification> {
    return this.createNewNotification({
      forUserId,
      data,
      type: UserNotificationType.RentingRequestIsApproved,
    });
  }

  declineRequestToUserNotification(
    forUserId: string,
    data: RequestDataNotificationModel,
  ): Promise<UserNotification> {
    return this.createNewNotification({
      forUserId,
      data,
      type: UserNotificationType.RentingRequestIsDeclined,
    });
  }

  startRequestToUserNotification(
    forUserId: string,
    data: RequestDataNotificationModel,
  ): Promise<UserNotification> {
    return this.createNewNotification({
      forUserId,
      data,
      type: UserNotificationType.RentingRequestIsInProgress,
    });
  }

  completeRequestToUserNotification(
    forUserId: string,
    data: RequestDataNotificationModel,
  ): Promise<UserNotification> {
    return this.createNewNotification({
      forUserId,
      data,
      type: UserNotificationType.RentingRequestIsCompleted,
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

      if (RENTING_REQUEST_TYPE_SET.has(item.type)) {
        const userInfo = await this.usersService.getUserDetailData(
          newItem.data.ownerRequestId,
        );
        const lenderUserInfo = await this.usersService.getUserDetailData(
          newItem.data.lenderRequestId,
        );

        newItem.data.ownerRequestUserInfo = userInfo
          ? {
              avatarImage: {
                url: userInfo.avatarImage?.url,
              },
              displayName: userInfo.displayName,
            }
          : null;

        newItem.data.lenderRequestUserInfo = lenderUserInfo
          ? {
              avatarImage: {
                url: lenderUserInfo.avatarImage?.url,
              },
              displayName: lenderUserInfo.displayName,
            }
          : null;
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
