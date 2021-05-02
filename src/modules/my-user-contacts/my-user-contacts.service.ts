import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { MyUserContact } from '@prisma/client';
import { OffsetPaginationDTO } from '../../models';

@Injectable()
export class MyUserContactsService {
  constructor(private prismaService: PrismaService) {}

  addUserToMyContactList(
    myUserId: string,
    connectToUserId: string,
  ): Promise<MyUserContact> {
    return this.prismaService.myUserContact.create({
      data: {
        ownerUserId: myUserId,
        user: {
          connect: {
            id: connectToUserId,
          },
        },
      },
    });
  }

  async deleteUserFromMyContactList(
    myUserId: string,
    removeUserIdFromMyList: string,
  ): Promise<MyUserContact> {
    const item = await this.prismaService.myUserContact.findUnique({
      where: {
        ownerUserId_userId: {
          ownerUserId: myUserId,
          userId: removeUserIdFromMyList,
        },
      },
    });

    if (!item) {
      throw new Error('This contact not exist');
    }

    return this.prismaService.myUserContact.delete({
      where: {
        ownerUserId_userId: {
          ownerUserId: myUserId,
          userId: removeUserIdFromMyList,
        },
      },
    });
  }

  async findAllMyContactList({
    userId,
    offset = 0,
    limit = 10,
  }): Promise<OffsetPaginationDTO<MyUserContact>> {
    const where = {
      ownerUserId: userId,
    };

    const items = await this.prismaService.myUserContact.findMany({
      where,
    });
    const count = await this.prismaService.myUserContact.count({
      where,
    });

    return {
      items,
      total: count,
      offset,
      limit,
    };
  }
}
