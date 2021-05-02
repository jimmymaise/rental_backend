import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { UserInfoDTO } from './user-info.dto';
import { toUserInfoDTO } from './helpers';
import { OffsetPaginationDTO } from '../../models';

@Injectable()
export class AdminUsersService {
  constructor(private prismaService: PrismaService) {}

  async findAllUsers({
    searchValue = '',
    offset = 0,
    limit = 10,
    sortByFields,
  }): Promise<OffsetPaginationDTO<UserInfoDTO>> {
    const validSortBy = {
      email: 'email',
      phoneNumber: 'phoneNumber',
      lastSignedIn: 'lastSignedIn',
      isBlocked: 'isBlocked',
    };
    let orderBy: any[] = [
      {
        lastSignedIn: 'desc',
      },
    ];

    if (sortByFields && sortByFields.length) {
      sortByFields.forEach((sortBy) => {
        const sortByChunk = sortBy.split(':');
        const sortKey = validSortBy[sortByChunk[0]];
        if (sortKey) {
          orderBy = [
            {
              [sortKey]: sortByChunk[1] || 'asc',
            },
          ];
        }
      });
    }

    let where: any = {};

    if (searchValue) {
      where = {
        OR: {
          email: {
            contains: searchValue,
            mode: 'insensitive',
          },
          phoneNumber: {
            contains: searchValue,
          },
          userInfo: {
            displayName: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
        },
      };
    }
    const users = await this.prismaService.user.findMany({
      orderBy,
      include: {
        userInfo: true,
      },
      where,
    });
    const count = await this.prismaService.user.count({
      where,
    });

    return {
      items: users.map((user) => toUserInfoDTO(user, user.userInfo)),
      total: count,
      offset,
      limit,
    };
  }
}
