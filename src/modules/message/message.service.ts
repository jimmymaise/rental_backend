import { Injectable } from '@nestjs/common';
import { ChatConversation, ChatConversationMember } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { PaginationDTO } from '../../models';

interface AddMessageData {
  id: string
  fromUserId: string
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
    return this.prismaService.chatConversation.findUnique({ where: { id }, include: { chatConversationMembers: true } }).chatConversationMembers({})
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

  addMessage({ id, fromUserId, replyToId, chatConversationId, content }: AddMessageData): Promise<ChatConversation> {
    return this.prismaService.chatMessage.create({
      data: {
        id,
        fromUserId,
        replyTo: {
          connect: {
            id: replyToId
          }
        },
        content,
        chatConversation: {
          connect: {
            id: chatConversationId
          }
        }
      }
    })
  }
}
