import { Injectable } from '@nestjs/common';
import { UserChatSession } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { PaginationDTO } from '../../models';

interface AddMessageData {
  fromUserId: string
  replyToId?: string
  userChatSessionId: string
  content: string
}

@Injectable()
export class MessageService {
  constructor(
    private prismaService: PrismaService
  ) {}

  createNewSession(memberIds: string[]): Promise<UserChatSession> {
    return this.prismaService.userChatSession.create({
      data: {
        userChatSessionMembers: {
          create: memberIds.map((item) => ({
            userId: item
          }))
        }
      }
    })
  }

  getSession(sessionId: string): Promise<UserChatSession> {
    return this.prismaService.userChatSession.findUnique({ where: { id: sessionId } })
  }

  async findAllSessionIncludingMe({
    offset = 0,
    limit = 10,
    userId
  }): Promise<PaginationDTO<UserChatSession>> {
    const items = await this.prismaService.userChatSession.findMany({
      where: {
        userChatSessionMembers: {
          some: {
            userId
          }
        }
      },
      skip: offset,
      take: limit
    });
    const count = await this.prismaService.userChatSession.count({
      where: {
        userChatSessionMembers: {
          some: {
            userId
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

  addMessage({ fromUserId, replyToId, userChatSessionId, content }: AddMessageData): Promise<UserChatSession> {
    return this.prismaService.userChatMessage.create({
      data: {
        fromUserId,
        replyTo: {
          connect: {
            id: replyToId
          }
        },
        content,
        userChatSession: {
          connect: {
            id: userChatSessionId
          }
        }
      }
    })
  }
}
