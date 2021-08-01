import { Injectable } from '@nestjs/common';
import {
  ChatConversation,
  ChatConversationMember,
  ChatMessage,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { OffsetPaginationDTO } from '../../models';
import { UserInfoDTO } from '../users/user-info.dto';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';

interface MessageData {
  id?: string;
  fromUserId: string;
  fromOrgId?: string;
  fromUserInfo?: UserInfoDTO;
  replyToId?: string;
  chatConversationId: string;
  content: string;
}

export interface MessageInfoModel {
  unReadCount: number;
}

@Injectable()
export class MessageService {
  constructor(
    private prismaService: PrismaService,
    private userService: UsersService,
    private organizationService: OrganizationsService,
  ) {}

  createNewConversation(
    memberIds: string[],
    createdBy: string,
  ): Promise<ChatConversation> {
    return this.prismaService.chatConversation.create({
      data: {
        createdBy,
        chatConversationMembers: {
          create: memberIds.map((item) => ({
            userId: item,
          })),
        },
      },
    });
  }

  async isUserMemberInTheConversation(
    conversationId: string,
    memberId: string,
  ): Promise<boolean> {
    return (
      (await this.prismaService.chatConversationMember.findUnique({
        where: {
          chatConversationId_userId: {
            chatConversationId: conversationId,
            userId: memberId,
          },
        },
      })) !== null
    );
  }

  async findConversationUniqueByMembers(
    memberIds: string[],
  ): Promise<ChatConversation> {
    const conversationMembersResultTmp = await this.prismaService.$queryRaw(
      `
        SELECT "chatConversationId", COUNT("chatConversationId") as "memberCount" FROM public."ChatConversationMember"
        WHERE (${memberIds
          .map((id) => `"userId"='${id}'`)
          .join(' OR ')}) AND "orgId" IS NULL
        GROUP BY "chatConversationId"
        HAVING COUNT("chatConversationId") = ${memberIds.length}
      `,
    );

    const conversationMembersResult = conversationMembersResultTmp[0];

    if (!conversationMembersResult?.chatConversationId) {
      return null;
    }

    return this.prismaService.chatConversation.findUnique({
      where: {
        id: conversationMembersResult.chatConversationId,
      },
    });
  }

  createNewConversationBetweenUserAndOrg(
    userId: string,
    toOrg: {
      userId: string;
      orgId: string;
    },
    createdBy: string,
  ): Promise<ChatConversation> {
    return this.prismaService.chatConversation.create({
      data: {
        createdBy,
        chatConversationMembers: {
          create: [
            {
              userId,
            },
            {
              userId: toOrg.userId,
              orgId: toOrg.orgId,
            },
          ],
        },
      },
      include: {
        chatConversationMembers: true,
      },
    });
  }

  async findConversationBetweenUserAndOrg(
    userId: string,
    orgId: string,
    orgCreatedBy: string,
  ): Promise<ChatConversation> {
    const conversationMembersResultTmp = await this.prismaService.$queryRaw(
      `
        SELECT "chatConversationId", COUNT("chatConversationId") as "memberCount" FROM public."ChatConversationMember"
        WHERE ("userId"='${userId}' AND "userId" != '${orgCreatedBy}' AND "orgId" IS NULL) OR ("userId"='${orgCreatedBy}' AND "orgId"='${orgId}')
        GROUP BY "chatConversationId"
        HAVING COUNT("chatConversationId") = 2
      `,
    );

    const conversationMembersResult = conversationMembersResultTmp[0];
    console.log('conversationMembersResult', conversationMembersResult);
    if (!conversationMembersResult?.chatConversationId) {
      return null;
    }

    return this.prismaService.chatConversation.findUnique({
      where: {
        id: conversationMembersResult.chatConversationId,
      },
      include: {
        chatConversationMembers: true,
      },
    });
  }

  getConversation(id: string): Promise<ChatConversation> {
    return this.prismaService.chatConversation.findUnique({ where: { id } });
  }

  getConversationMembers(id: string): Promise<ChatConversationMember[]> {
    return this.prismaService.chatConversation
      .findUnique({ where: { id } })
      .chatConversationMembers({});
  }

  // async countUnReadConversation(userId: string): Promise<number> {
  //   const unReadCount = await this.prismaService.chatConversation.count({
  //     where: {
  //       chatConversationMembers: {
  //         some: {
  //           userId,
  //         },
  //       },
  //       chatMessages: {
  //         some: {
  //           fromUserId: {
  //             not: userId,
  //           },
  //           replyBy: undefined,
  //           isRead: false,
  //         },
  //       },
  //     },
  //   });

  //   return unReadCount;
  // }

  async findAllMyConversations({
    offset = 0,
    limit = 10,
    userId,
  }): Promise<OffsetPaginationDTO<ChatConversation>> {
    const items = await this.prismaService.chatConversation.findMany({
      where: {
        chatConversationMembers: {
          some: {
            userId,
            orgId: null,
          },
        },
      },
      include: {
        chatConversationMembers: true,
        chatMessages: {
          where: {
            replyBy: {
              is: null,
            },
          },
        },
      },
      skip: offset,
      take: limit,
    });
    const count = await this.prismaService.chatConversation.count({
      where: {
        chatConversationMembers: {
          some: {
            userId,
            orgId: null,
          },
        },
      },
    });

    return {
      items,
      total: count,
      offset,
      limit,
    };
  }

  async findAllMyOrgConversations({
    offset = 0,
    limit = 10,
    orgId,
  }): Promise<OffsetPaginationDTO<ChatConversation>> {
    const items = await this.prismaService.chatConversation.findMany({
      where: {
        chatConversationMembers: {
          some: {
            orgId,
          },
        },
      },
      include: {
        chatConversationMembers: true,
        chatMessages: {
          where: {
            replyBy: {
              is: null,
            },
          },
        },
      },
      skip: offset,
      take: limit,
    });
    const count = await this.prismaService.chatConversation.count({
      where: {
        chatConversationMembers: {
          some: {
            orgId,
          },
        },
      },
    });

    return {
      items,
      total: count,
      offset,
      limit,
    };
  }

  addMessage({
    fromUserId,
    fromOrgId,
    replyToId,
    chatConversationId,
    content,
  }: MessageData): Promise<ChatMessage> {
    const data: any = {
      fromUserId,
      fromOrgId,
      content,
      chatConversation: {
        connect: {
          id: chatConversationId,
        },
      },
    };

    if (replyToId) {
      data.replyTo = {
        connect: {
          id: replyToId,
        },
      };
    }

    return this.prismaService.chatMessage.create({
      data,
    });
  }

  async findAllMyMessagesInConversation({
    conversationId,
  }): Promise<MessageData[]> {
    // TODO: HARD CODE 500 Messages
    const items = await this.prismaService.$queryRaw(
      `
        WITH RECURSIVE recursive_message_query(chatConversationId, replyToId, id, content, fromUserId, createdDate, root, level)
        AS (
          SELECT "chatConversationId", "replyToId", "id", "content", "fromUserId", "createdDate", ARRAY["id"], 0
          FROM public."ChatMessage"
          WHERE  "chatConversationId"='${conversationId}' AND "replyToId" IS NULL
          UNION ALL
            SELECT childMessage."chatConversationId", childMessage."replyToId", childMessage."id", childMessage."content", childMessage."fromUserId", childMessage."createdDate", root || ARRAY[childMessage."id"], recursive_message_query."level" + 1
            FROM recursive_message_query
            JOIN public."ChatMessage" childMessage
            ON (childMessage."replyToId" = recursive_message_query."id")
        )
        SELECT * FROM recursive_message_query
        ORDER BY root desc
        LIMIT 500
      `,
    );

    const result: MessageData[] = [];
    for (let i = 0; i < items.length; i++) {
      const currentItem = items[i];
      const fromUserInfo = await this.userService.getUserDetailData(
        currentItem['fromuserid'],
      );

      result.push({
        id: currentItem['id'],
        fromUserId: currentItem['fromuserid'],
        fromUserInfo: {
          id: fromUserInfo.id,
          displayName: fromUserInfo.displayName,
          avatarImage: fromUserInfo.avatarImage,
          coverImage: fromUserInfo.coverImage,
          currentOrgId: fromUserInfo.currentOrgId,
        },
        replyToId: currentItem['replytoid'],
        chatConversationId: currentItem['chatconversationid'],
        content: currentItem['content'],
      });
    }

    return result;
  }

  async markMessageAsRead(messageId: string): Promise<ChatMessage> {
    return await this.prismaService.chatMessage.update({
      where: {
        id: messageId,
      },

      data: {
        isRead: true,
      },
    });
  }
}
