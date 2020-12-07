import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'

import { WishingItemsService } from './wishing-items.service'
import {
  WishingItem,
} from '@prisma/client';
import {
  GuardUserPayload,
  CurrentUser,
  GqlAuthGuard
} from '../auth'
import { PaginationDTO } from '../../models'
import { WishingItemDTO } from './wishing-item.dto'

@Resolver('WishingItem')
export class WishingItemsResolvers {
  constructor(private readonly wishingItemsService: WishingItemsService) {}

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async addItemToMyWishlist(
    @CurrentUser() user: GuardUserPayload,
    @Args('itemId') itemId: string,
  ): Promise<WishingItem> {
    return this.wishingItemsService.addNewItemToMyWishlist(user.id, itemId)
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async deleteItemFromMyWishlist(
    @CurrentUser() user: GuardUserPayload,
    @Args('itemId') itemId: string,
  ): Promise<WishingItem> {
    return this.wishingItemsService.deleteItemFromMyWishlist(user.id, itemId)
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async feedMyWishlist(
    @CurrentUser() user: GuardUserPayload,
    @Args('query') query: {
      offset: number,
      limit: number
    }
  ): Promise<PaginationDTO<WishingItemDTO>> {
    const { offset, limit } = query || {}
    const actualLimit = limit && limit > 100 ? 100 : limit
    const result = await this.wishingItemsService.findAllMyItemWishlist({
      userId: user.id,
      offset,
      limit
    })

    return {
      items: result.items.map((wishingItem: any) => {
        const item = wishingItem.item
        return {
          id: item.id,
          name: item.name,
          slug: item.slug,
          categories: item.categories,
          areas: item.areas,
          images: item.images && item.images.length ? JSON.parse(item.images) : [],
        }
      }),
      total: result.total,
      offset: offset || 0,
      limit: actualLimit
    }
  }
}

