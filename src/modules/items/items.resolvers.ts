import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ItemStatus } from '@prisma/client';

import { ItemsService } from './items.service';
import { UserItemsService } from './user-items.service';
import { AdminItemsService } from './admin-items.service';
import { ItemUserInputDTO } from './item-user-input.dto';
import { ItemDTO, toItemDTO } from './item.dto';
import {
  GuardUserPayload,
  CurrentUser,
  GqlAuthGuard,
  EveryoneGqlAuthGuard,
} from '../auth';
import { PaginationDTO } from '../../models';
import { UsersService } from '../users/users.service';
import { SearchKeywordService } from '../search-keyword/search-keyword.service';
import { WishingItemsService } from '../wishing-items/wishing-items.service';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { GqlPermissionsGuard } from '@modules/auth/permission/gql-permissions.guard';

@Resolver('Item')
export class ItemsResolvers {
  constructor(
    private itemService: ItemsService,
    private userItemService: UserItemsService,
    private usersService: UsersService,
    private adminItemService: AdminItemsService,
    private searchKeywordService: SearchKeywordService,
    private wishingItemService: WishingItemsService,
  ) {}

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async listingNewItem(
    @CurrentUser() user: GuardUserPayload,
    @Args('itemData') itemData: ItemUserInputDTO,
    @Args('includes') includes: string[],
  ): Promise<ItemDTO> {
    return new Promise((resolve, reject) => {
      this.itemService
        .createItemForUser(itemData, user.id, includes)
        .then((item) => {
          resolve(toItemDTO(item, null));
        })
        .catch(reject);
    });
  }

  @Query()
  @UseGuards(EveryoneGqlAuthGuard)
  async feed(
    @CurrentUser() user: GuardUserPayload,
    @Args('query')
    query: {
      search: string;
      offset: number;
      limit: number;
      areaId: string;
      categoryId: string;
      includes: string[];
      sortByFields: string[];
      checkWishList?: boolean;
    },
  ): Promise<PaginationDTO<ItemDTO>> {
    const {
      search,
      offset,
      limit,
      areaId,
      categoryId,
      includes,
      sortByFields,
      checkWishList,
    } = query || {};
    const actualLimit = limit && limit > 100 ? 100 : limit;

    if (search && search.length) {
      await this.searchKeywordService.increaseKeywordCount(search);
    }

    const result = await this.itemService.findAllAvailablesItem({
      searchValue: search,
      offset,
      limit: actualLimit,
      areaId,
      categoryId,
      includes,
      sortByFields,
    });

    const items = [];

    for (let i = 0; i < result.items.length; i++) {
      const newItem = toItemDTO(result.items[i], user?.id);

      if (result.items[i].ownerUserId) {
        newItem.createdBy = await this.usersService.getUserDetailData(
          result.items[i].ownerUserId,
        );
      }

      if (user && checkWishList) {
        newItem.isInMyWishList =
          (await this.wishingItemService.findUnique(user.id, newItem.id)) !==
          null;
      }

      items.push(newItem);
    }

    return {
      items,
      total: result.total,
      offset: offset || 0,
      limit: actualLimit,
    };
  }

  @Query()
  @UseGuards(EveryoneGqlAuthGuard)
  async feedDetail(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
    @Args('includes') includes: string[],
    @Args('checkWishList') checkWishList: boolean,
  ): Promise<ItemDTO> {
    const item = await this.itemService.findOne(id, includes);
    const enhancedItem = toItemDTO(item, user?.id);

    if (item.ownerUserId) {
      enhancedItem.createdBy = await this.usersService.getUserDetailData(
        item.ownerUserId,
      );
    }

    if (user && checkWishList) {
      enhancedItem.isInMyWishList =
        (await this.wishingItemService.findUnique(user.id, enhancedItem.id)) !==
        null;
    }

    return enhancedItem;
  }

  // #### For Me

  @Query()
  @UseGuards(GqlAuthGuard)
  async feedMyItems(
    @CurrentUser() user: GuardUserPayload,
    @Args('query')
    query: {
      search: string;
      offset: number;
      limit: number;
      includes: string[];
      checkWishList?: boolean;
    },
  ): Promise<PaginationDTO<ItemDTO>> {
    const { search, offset, limit, includes, checkWishList } = query || {};
    const actualLimit = limit && limit > 100 ? 100 : limit;
    const result = await this.userItemService.findAllItemsCreatedByUser({
      createdBy: user.id,
      searchValue: search,
      offset,
      limit: actualLimit,
      includes,
    });

    const items = [];

    for (let i = 0; i < result.items.length; i++) {
      const newItem = toItemDTO(result.items[i], user.id);

      if (checkWishList) {
        newItem.isInMyWishList =
          (await this.wishingItemService.findUnique(user.id, newItem.id)) !==
          null;
      }

      items.push(newItem);
    }

    return {
      items,
      total: result.total,
      offset: offset || 0,
      limit: actualLimit,
    };
  }

  @Query()
  @UseGuards(EveryoneGqlAuthGuard)
  async feedUserPublicItems(
    @CurrentUser() user: GuardUserPayload,
    @Args('userId') userId: string,
    @Args('query')
    query: {
      search: string;
      offset: number;
      limit: number;
      includes: string[];
      checkWishList?: boolean;
    },
  ): Promise<PaginationDTO<ItemDTO>> {
    const { search, offset, limit, includes, checkWishList } = query || {};
    const actualLimit = limit && limit > 100 ? 100 : limit;
    const result = await this.userItemService.findAllPublicItemsCreatedByUser({
      createdBy: userId,
      searchValue: search,
      offset,
      limit: actualLimit,
      includes,
    });

    const items = [];
    for (let i = 0; i < result.items.length; i++) {
      const newItem = toItemDTO(result.items[i], user?.id);

      if (result.items[i].ownerUserId) {
        newItem.createdBy = await this.usersService.getUserDetailData(
          result.items[i].ownerUserId,
        );
      }

      if (user && checkWishList) {
        newItem.isInMyWishList =
          (await this.wishingItemService.findUnique(user.id, newItem.id)) !==
          null;
      }

      items.push(newItem);
    }

    return {
      items,
      total: result.total,
      offset: offset || 0,
      limit: actualLimit,
    };
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async feedMyItemDetail(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
    @Args('includes') includes: string[],
    @Args('checkWishList') checkWishList: boolean,
  ): Promise<ItemDTO> {
    const item = await this.userItemService.findOneDetailForEdit(
      id,
      user.id,
      includes,
    );

    const enhancedItem = toItemDTO(item, user.id);

    if (checkWishList) {
      enhancedItem.isInMyWishList =
        (await this.wishingItemService.findUnique(user.id, enhancedItem.id)) !==
        null;
    }

    return enhancedItem;
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updateMyItem(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
    @Args('itemData') itemData: ItemUserInputDTO,
  ): Promise<ItemDTO> {
    return new Promise((resolve, reject) => {
      this.userItemService
        .updateMyItem(id, user.id, itemData)
        .then((item) => {
          resolve(toItemDTO(item, user.id));
        })
        .catch(reject);
    });
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async deleteMyItem(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
  ): Promise<ItemDTO> {
    return new Promise((resolve, reject) => {
      this.userItemService
        .softDeleteMyItem(id, user.id)
        .then((item) => {
          if (!item) {
            throw new Error('Item is not existing!');
          }

          resolve(toItemDTO(item, user.id));
        })
        .catch(reject);
    });
  }

  // FOR ADMIN ONLY
  @Query()
  @Permissions('ROOT')
  @UseGuards(GqlPermissionsGuard)
  @UseGuards(GqlAuthGuard)
  async adminFeed(
    @CurrentUser() user: GuardUserPayload,
    @Args('query')
    query: {
      search: string;
      offset: number;
      limit: number;
      areaId: string;
      categoryId: string;
      includes: string[];
      sortByFields: string[];
    },
  ): Promise<PaginationDTO<ItemDTO>> {
    const {
      search,
      offset,
      limit,
      areaId,
      categoryId,
      includes,
      sortByFields,
    } = query || {};
    const actualLimit = limit && limit > 100 ? 100 : limit;

    const result = await this.adminItemService.findAllItems({
      searchValue: search,
      offset,
      limit: actualLimit,
      areaId,
      categoryId,
      includes,
      sortByFields,
    });

    const items = [];

    for (let i = 0; i < result.items.length; i++) {
      const newItem = toItemDTO(result.items[i], user.id, user.permissions);

      if (result.items[i].ownerUserId) {
        newItem.createdBy = await this.usersService.getUserDetailData(
          result.items[i].ownerUserId,
        );
      }

      items.push(newItem);
    }

    return {
      items,
      total: result.total,
      offset: offset || 0,
      limit: actualLimit,
    };
  }

  @Mutation()
  @Permissions('ROOT')
  @UseGuards(GqlPermissionsGuard)
  async updateItemStatus(
    @Args('id') id: string,
    @Args('status') status: ItemStatus,
  ): Promise<ItemDTO> {
    const result = await this.adminItemService.changeStatus(id, status);

    return toItemDTO(result);
  }
}
