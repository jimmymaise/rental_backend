import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { MyContactBook } from '@prisma/client';
import { OffsetPaginationDTO } from '../../models';
import { MyContactBookType } from './constants';

@Injectable()
export class MyContactBooksService {
  constructor(private prismaService: PrismaService) {}

  // User
  addUserToMyContactBook(
    myUserId: string,
    connectToUserId: string,
  ): Promise<MyContactBook> {
    return this.prismaService.myContactBook.create({
      data: {
        ownerUserId: myUserId,
        contactId: connectToUserId,
        type: MyContactBookType.User,
      },
    });
  }

  async deleteUserFromMyContactBook(
    myUserId: string,
    removeUserIdFromMyList: string,
  ): Promise<MyContactBook> {
    const item = await this.prismaService.myContactBook.findUnique({
      where: {
        ownerUserId_type_contactId: {
          ownerUserId: myUserId,
          contactId: removeUserIdFromMyList,
          type: MyContactBookType.User,
        },
      },
    });

    if (!item) {
      throw new Error('This contact not exist');
    }

    return this.prismaService.myContactBook.delete({
      where: {
        ownerUserId_type_contactId: {
          ownerUserId: myUserId,
          contactId: removeUserIdFromMyList,
          type: MyContactBookType.User,
        },
      },
    });
  }

  // Organization
  addOrgToMyContactBook(
    myUserId: string,
    orgId: string,
  ): Promise<MyContactBook> {
    return this.prismaService.myContactBook.create({
      data: {
        ownerUserId: myUserId,
        contactId: orgId,
        type: MyContactBookType.Organization,
      },
    });
  }

  async deleteOrgFromMyContactBook(
    myUserId: string,
    removeOrgIdFromMyList: string,
  ): Promise<MyContactBook> {
    const item = await this.prismaService.myContactBook.findUnique({
      where: {
        ownerUserId_type_contactId: {
          ownerUserId: myUserId,
          contactId: removeOrgIdFromMyList,
          type: MyContactBookType.Organization,
        },
      },
    });

    if (!item) {
      throw new Error('This contact not exist');
    }

    return this.prismaService.myContactBook.delete({
      where: {
        ownerUserId_type_contactId: {
          ownerUserId: myUserId,
          contactId: removeOrgIdFromMyList,
          type: MyContactBookType.Organization,
        },
      },
    });
  }

  async findAllMyContactBook({
    userId,
    offset = 0,
    limit = 10,
  }): Promise<OffsetPaginationDTO<MyContactBook>> {
    const where = {
      ownerUserId: userId,
    };

    const items = await this.prismaService.myContactBook.findMany({
      where,
    });
    const count = await this.prismaService.myContactBook.count({
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
