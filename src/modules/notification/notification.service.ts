import { Injectable } from '@nestjs/common';
import { UserNotification, UserNotificationType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { OffsetPaginationDTO } from '../../models';
import { NotificationDTO } from './notification.dto';
import { RequestDataNotificationModel } from './models/request-data-notification.model';
import { NotificationInfoModel } from './models/notication-info.model';
import { UsersService } from '../users/users.service';
import { RENTING_REQUEST_TYPE_SET } from './constants';
import { MessageGateway } from '../message/message.gateway';

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
    private messageGateway: MessageGateway,
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

  private async createNewNotification(
    data: NotificationDTO,
  ): Promise<UserNotification> {
    const newItem = await this.prismaService.userNotification.create({
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

    if (RENTING_REQUEST_TYPE_SET.has(newItem.type)) {
      const data = await this.convertToRentingRequestNotificationItem(newItem);
      this.messageGateway.sendNotificationMessage(newItem.forUserId, data);
    }

    return newItem;
  }

  async convertToRentingRequestNotificationItem(
    item: UserNotification,
  ): Promise<NotificationDTO> {
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

      return newItem;
    }
  }

  async findAllMyNotifications({
    offset = 0,
    limit = 10,
    userId,
  }): Promise<OffsetPaginationDTO<NotificationDTO>> {
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
      const newItem = await this.convertToRentingRequestNotificationItem(item);

      newItems.push(newItem);
    }

    return {
      items: newItems,
      total: count,
      offset,
      limit,
    };
  }

  async unReadNotificationsCount(userId): Promise<NotificationInfoModel> {
    const unReadCount = await this.prismaService.userNotification.count({
      where: {
        isRead: false,
        forUserId: userId,
      },
    });

    return {
      unReadCount,
    };
  }

  async setAllNotificationRead(userId): Promise<any> {
    return await this.prismaService.userNotification.updateMany({
      where: {
        isRead: false,
        forUserId: userId,
      },
      data: {
        isRead: true,
      },
    });
  }
}
