import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import {
  WishingItem,
} from '@prisma/client';
import { PaginationDTO } from '../../models';

@Injectable()
export class WishingItemsService {
  constructor(
    private prismaService: PrismaService
  ) {}

  findUnique(userId: string, itemId: string): Promise<WishingItem> {
    return this.prismaService.wishingItem.findUnique({
      where: {
        ownerUserId_itemId: {
          ownerUserId: userId,
          itemId
        }
      }
    })
  }

  addNewItemToMyWishlist(userId: string, itemId: string): Promise<WishingItem> {
    return this.prismaService.wishingItem.create({
      data: {
        ownerUserId: userId,
        item: {
          connect: {
            id: itemId
          }
        }
      }
    })
  }

  async deleteItemFromMyWishlist(userId: string, itemId: string): Promise<WishingItem> {
    return this.prismaService.wishingItem.delete({
      where: {
        ownerUserId_itemId: {
          ownerUserId: userId,
          itemId
        }
      }
    })
  }

  async findAllMyItemWishlist({
    userId,
    offset = 0,
    limit = 10,
    includes = []
  }): Promise<PaginationDTO<WishingItem>> {
    const where = {
      ownerUserId: userId
    }

    let include = {}

    if (includes.includes('item')) {
      include = {
        item: {
          include: {
            categories: true,
            areas: true
          }
        }
      }
    }

    const items = await this.prismaService.wishingItem.findMany({
      where,
      skip: offset,
      take: limit,
      include
    });
    const count = await this.prismaService.item.count({
      where,
      skip: offset,
      take: limit
    });

    return {
      items,
      total: count,
      offset,
      limit
    };
  }
}
