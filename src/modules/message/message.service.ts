import { Injectable } from '@nestjs/common';
import { ChatConversation, ChatConversationMember } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { PaginationDTO } from '../../models';
import { UserInfoDTO } from '../users/user-info.dto'

interface MessageData {
  id: string
  fromUserId: string
  fromUserInfo?: UserInfoDTO
  replyToId?: string
  chatConversationId: string
  content: string
}

@Injectable()
export class MessageService {
  constructor(
    private prismaService: PrismaService
  ) {}

  createNewConversation(memberIds: string[]): Promise<ChatConversation> {
    return this.prismaService.chatConversation.create({
      data: {
        chatConversationMembers: {
          create: memberIds.map((item) => ({
            userId: item
          }))
        }
      }
    })
  }

  async isUserMemberInTheConversation(conversationId: string, memberId: string): Promise<boolean> {
    return await this.prismaService.chatConversationMember.findUnique({
      where: {
        chatConversationId_userId: {
          chatConversationId: conversationId,
          userId: memberId
        }
      }
    }) !== null
  }

  findConversationUniqueByMembers(memberIds: string[]): Promise<ChatConversation> {
    const orConditional = memberIds.map((userId) => ({
      userId
    }))
    return this.prismaService.chatConversation.findFirst({
      where: {
        chatConversationMembers: {
          every: {
            OR: orConditional
          }
        },
      },
      include: {
        chatConversationMembers: true,
      }
    })
  }

  getConversation(id: string): Promise<ChatConversation> {
    return this.prismaService.chatConversation.findUnique({ where: { id } })
  }

  getConversationMembers(id: string): Promise<ChatConversationMember[]> {
    return this.prismaService.chatConversation.findUnique({ where: { id } }).chatConversationMembers({})
  }

  async findAllMyConversations({
    offset = 0,
    limit = 10,
    userId
  }): Promise<PaginationDTO<ChatConversation>> {
    const items = await this.prismaService.chatConversation.findMany({
      where: {
        chatConversationMembers: {
          some: {
            userId
          }
        },
        chatMessages: {
          some: {
            fromUserId: {
              not: null
            }
          }
        }
      },
      include: {
        chatConversationMembers: true
      },
      skip: offset,
      take: limit
    });
    const count = await this.prismaService.chatConversation.count({
      where: {
        chatConversationMembers: {
          some: {
            userId
          }
        },
        chatMessages: {
          some: {
            fromUserId: {
              not: null
            }
          }
        }
      }
    });

    return {
      items,
      total: count,
      offset,
      limit
    };
  }

  addMessage({ id, fromUserId, replyToId, chatConversationId, content }: MessageData): Promise<ChatConversation> {
    const data: any = {
      id,
      fromUserId,
      content,
      chatConversation: {
        connect: {
          id: chatConversationId
        }
      }
    }

    if (replyToId) {
      data.replyTo = {
        connect: {
          id: replyToId
        }
      }
    }

    return this.prismaService.chatMessage.create({
      data
    })
  }

  async findAllMyMessagesInConversation({
    conversationId
  }): Promise<PaginationDTO<MessageData>> {
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
      `
    )
   
    return null
  }
}
