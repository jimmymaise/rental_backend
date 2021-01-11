import { Injectable } from '@nestjs/common';
import { UserNotification } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { PaginationDTO } from '../../models';
import { NotificationDTO } from './notification.dto';

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
  constructor(private prismaService: PrismaService) {}

  createNewNotification(data: NotificationDTO): Promise<UserNotification> {
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
    const count = await this.prismaService.chatConversation.count({
      where: {
        chatConversationMembers: {
          some: {
            userId,
          },
        },
      },
    });

    return {
      items: items.map((item) => toNotificationDTO(item)),
      total: count,
      offset,
      limit,
    };
  }
}
