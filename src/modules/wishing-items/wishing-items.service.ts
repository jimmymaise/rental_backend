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

  async deleteItemFromMyWishlist(id: string, userId: string): Promise<WishingItem> {
    const item = await this.prismaService.wishingItem.findOne({
      where: {
        id
      }
    })

    if (item.ownerUserId !== userId) {
      throw new Error('Wishing Item not existing')
    }

    return this.prismaService.wishingItem.delete({
      where: {
        id
      }
    })
  }

  async findAllMyItemWishlist({
    userId,
    offset = 0,
    limit = 10
  }): Promise<PaginationDTO<WishingItem>> {
    const where = {
      ownerUserId: userId
    }

    const items = await this.prismaService.wishingItem.findMany({
      where,
      include: {
        item: {
          include: {
            categories: true,
            areas: true
          }
        }
      }
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
