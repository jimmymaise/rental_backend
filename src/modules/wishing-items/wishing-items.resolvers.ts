import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';

import { WishingItemsService } from './wishing-items.service';
import { WishingItem } from '@prisma/client';
import { GuardUserPayload, CurrentUser, GqlAuthGuard } from '../auth';
import { PaginationDTO } from '../../models';
import { WishingItemDTO } from './wishing-item.dto';
import { ItemDTO, toItemDTO } from '../items/item.dto';
import { UsersService } from '../users/users.service';

@Resolver('WishingItem')
export class WishingItemsResolvers {
  constructor(
    private readonly wishingItemsService: WishingItemsService,
    private usersService: UsersService,
  ) {}

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async addItemToMyWishlist(
    @CurrentUser() user: GuardUserPayload,
    @Args('itemId') itemId: string,
  ): Promise<WishingItem> {
    return this.wishingItemsService.addNewItemToMyWishlist(user.id, itemId);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async deleteItemFromMyWishlist(
    @CurrentUser() user: GuardUserPayload,
    @Args('itemId') itemId: string,
  ): Promise<WishingItem> {
    return this.wishingItemsService.deleteItemFromMyWishlist(user.id, itemId);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async feedMyWishlist(
    @CurrentUser() user: GuardUserPayload,
    @Args('query')
    query: {
      offset: number;
      limit: number;
      includes: string[];
    },
  ): Promise<PaginationDTO<ItemDTO>> {
    const { offset, limit, includes } = query || {};
    const actualLimit = limit && limit > 100 ? 100 : limit;
    const result = await this.wishingItemsService.findAllMyItemWishlist({
      userId: user.id,
      offset,
      limit,
      includes,
    });

    const items = [];

    for (let i = 0; i < result.items.length; i++) {
      const item = (result.items[i] as any).item;
      const newItem = toItemDTO(item, user.id);

      if (item.ownerUserId) {
        newItem.createdBy = await this.usersService.getUserDetailData(
          item.ownerUserId,
        );
      }

      newItem.isInMyWishList = true;

      items.push(newItem);
    }

    return {
      items,
      total: result.total,
      offset: offset || 0,
      limit: actualLimit,
    };
  }
}
