import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import {
  MyUserContact,
} from '@prisma/client'
import { PaginationDTO } from '../../models'

@Injectable()
export class MyUserContactsService {
  constructor(
    private prismaService: PrismaService
  ) {}

  addUserToMyContactList(myUserId: string, connectToUserId: string): Promise<MyUserContact> {
    return this.prismaService.myUserContact.create({
      data: {
        ownerUserId: myUserId,
        user: {
          connect: {
            id: connectToUserId
          }
        }
      }
    })
  }

  async deleteUserFromMyContactList(myUserId: string, removeUserIdFromMyList: string): Promise<MyUserContact> {
    const item = await this.prismaService.myUserContact.findFirst({
      where: {
        ownerUserId: myUserId,
        userId: removeUserIdFromMyList
      }
    })

    if (!item) {
      throw new Error('This contact not exist')
    }

    return this.prismaService.myUserContact.delete({
      where: {
        id: item.id
      }
    })
  }

  async findAllMyContactList({
    userId,
    offset = 0,
    limit = 10
  }): Promise<PaginationDTO<MyUserContact>> {
    const where = {
      ownerUserId: userId
    }

    const items = await this.prismaService.myUserContact.findMany({
      where,
    });
    const count = await this.prismaService.item.count({
      where
    });

    return {
      items,
      total: count,
      offset,
      limit
    };
  }
}
