import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Info } from '@nestjs/graphql';

import { ItemsService } from './items.service';
import { UserItemsService } from './user-items.service';
import { AdminItemsService } from './admin-items.service';
import { OrgItemsService } from './org-items.service';
import { ItemUserInputDTO } from './item-user-input.dto';
import { ItemDTO, toItemDTO } from './item.dto';
import {
  GuardUserPayload,
  CurrentUser,
  GqlAuthGuard,
  EveryoneGqlAuthGuard,
} from '../auth';
import { ItemStatus, OffsetPaginationDTO, RentingStatus } from '@app/models';
import { UsersService } from '../users/users.service';
import { SearchKeywordService } from '../search-keyword/search-keyword.service';
import { WishingItemsService } from '../wishing-items/wishing-items.service';
import { Permission } from '@modules/auth/permission/permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { GraphQLResolveInfo } from 'graphql';
import { QueryWithOffsetPagingDTO } from '@modules/users/user-info.dto';
import { GraphQLFieldHandler } from '@helpers/handlers/graphql-field-handler';
import { OrganizationsService } from '../organizations/organizations.service';

@Resolver('Item')
export class ItemsResolvers {
  constructor(
    private itemService: ItemsService,
    private userItemService: UserItemsService,
    private usersService: UsersService,
    private adminItemService: AdminItemsService,
    private searchKeywordService: SearchKeywordService,
    private wishingItemService: WishingItemsService,
    private orgItemsService: OrgItemsService,
    private organizationService: OrganizationsService,
  ) {}

  @Mutation()
  @UseGuards(GqlAuthGuard)
  @Permissions(Permission.NEED_LOGIN)
  async listingNewItem(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('itemData') itemData: ItemUserInputDTO,
  ): Promise<ItemDTO> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForNestedRelationalFields([
      { fieldName: 'categories', fieldPath: 'items.Item' },
      { fieldName: 'areas', fieldPath: 'items.Item' },
      { fieldName: 'org', fieldPath: 'items.Item' },
      { fieldName: 'rentingItemRequests', fieldPath: 'items.Item' },
    ]);
    const item = await this.itemService.createItemForUser(
      itemData,
      user.id,
      include,
      itemData.isFromOrg ? user.currentOrgId : null,
    );
    return toItemDTO(item, null);
  }

  @Query()
  @Permissions(Permission.NO_NEED_LOGIN)
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
  ): Promise<OffsetPaginationDTO<ItemDTO>> {
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

  // TODO: remove it
  @Query()
  @Permissions(Permission.NO_NEED_LOGIN)
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

  @Query()
  @Permissions(Permission.NO_NEED_LOGIN)
  @UseGuards(EveryoneGqlAuthGuard)
  async feedDetailByPID(
    @CurrentUser() user: GuardUserPayload,
    @Args('pid') pid: number,
    @Args('includes') includes: string[],
    @Args('checkWishList') checkWishList: boolean,
  ): Promise<ItemDTO> {
    const item = await this.itemService.findOneByPID(pid, includes);
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

    if (item.orgId) {
      enhancedItem.orgDetail =
        await this.organizationService.getOrgSummaryCache(item.orgId);
    }

    return enhancedItem;
  }

  // #### For Me

  @Query()
  @Permissions(Permission.NEED_LOGIN)
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
  ): Promise<OffsetPaginationDTO<ItemDTO>> {
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
  @Permissions(Permission.NO_NEED_LOGIN)
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
  ): Promise<OffsetPaginationDTO<ItemDTO>> {
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
  @Permissions(Permission.NEED_LOGIN)
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

  // #### FOR ORG ONLY

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_ITEM)
  @UseGuards(GqlAuthGuard)
  async feedOrgItemDetail(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
  ): Promise<ItemDTO> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForNestedRelationalFields([
      { fieldName: 'orgCategories' },
      { fieldName: 'areas' },
    ]);

    const item = await this.orgItemsService.findDetailForOrg(
      id,
      user.currentOrgId,
      include,
    );

    const enhancedItem = toItemDTO(item, user.id);

    return enhancedItem;
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.UPDATE_ITEM)
  @UseGuards(GqlAuthGuard)
  async updateOrgItem(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
    @Args('itemData') itemData: ItemUserInputDTO,
  ): Promise<ItemDTO> {
    return new Promise((resolve, reject) => {
      this.orgItemsService
        .updateOrgItem(id, user.currentOrgId, user.id, itemData)
        .then((item) => {
          resolve(toItemDTO(item, user.id));
        })
        .catch(reject);
    });
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.DELETE_ITEM)
  @UseGuards(GqlAuthGuard)
  async deleteOrgItem(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
  ): Promise<ItemDTO> {
    return new Promise((resolve, reject) => {
      this.orgItemsService
        .softDeleteOrgItem(id, user.currentOrgId, user.id)
        .then((item) => {
          if (!item) {
            throw new Error('Item is not existing!');
          }

          resolve(toItemDTO(item, user.id));
        })
        .catch(reject);
    });
  }

  @Query()
  @Permissions(Permission.NO_NEED_LOGIN)
  @UseGuards(EveryoneGqlAuthGuard)
  async feedOrgPublicItems(
    @CurrentUser() user: GuardUserPayload,
    @Args('orgId') orgId: string,
    @Args('query')
    query: {
      search: string;
      offset: number;
      limit: number;
      categoryId?: string;
      includes: string[];
      checkWishList?: boolean;
    },
  ): Promise<OffsetPaginationDTO<ItemDTO>> {
    const { search, offset, limit, includes, checkWishList, categoryId } =
      query || {};
    const actualLimit = limit && limit > 100 ? 100 : limit;
    const result = await this.orgItemsService.findAllPublicItemsCreatedByOrg({
      orgId,
      searchValue: search,
      categoryId,
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

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
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
  @Permissions(Permission.NEED_LOGIN)
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

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async setItemSystemRentingStatus(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
    @Args('status') status: RentingStatus,
  ): Promise<ItemDTO> {
    return new Promise((resolve, reject) => {
      this.userItemService
        .setSystemItemRentingStatus({
          id,
          userId: user.id,
          status,
        })
        .then((item) => {
          resolve(toItemDTO(item, user.id));
        })
        .catch(reject);
    });
  }

  // FOR ADMIN ONLY

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_ITEM)
  @UseGuards(GqlAuthGuard)
  async getMyOrgItemsWithPaging(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('search')
    search: string,
    @Args('paging')
    paging: QueryWithOffsetPagingDTO,
  ): Promise<OffsetPaginationDTO<ItemDTO>> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForNestedRelationalFields([
      { fieldName: 'categories', fieldPath: 'items.Item' },
      { fieldName: 'areas', fieldPath: 'items.Item' },
      { fieldName: 'org', fieldPath: 'items.Item' },
      { fieldName: 'rentingItemRequests', fieldPath: 'items.Item' },
    ]);

    return this.itemService.getAllItemsByOrgIdWithOffsetPaging({
      searchValue: search,
      orgId: user.currentOrgId,
      pageSize: paging.pageSize,
      offset: paging.offset,
      orderBy: paging.orderBy,
      include,
    });
  }

  @Query()
  @Permissions('ROOT')
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
  ): Promise<OffsetPaginationDTO<ItemDTO>> {
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
      const newItem = toItemDTO(result.items[i], user.id, true);

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
  async updateItemStatus(
    @Args('id') id: string,
    @Args('status') status: ItemStatus,
  ): Promise<ItemDTO> {
    const result = await this.adminItemService.changeStatus(id, status);

    return toItemDTO(result);
  }

  @Mutation()
  @Permissions('ROOT')
  async changeVerifyStatus(
    @Args('id') id: string,
    @Args('isVerified') isVerified: boolean,
  ): Promise<ItemDTO> {
    const result = await this.adminItemService.changeVerifyStatus(
      id,
      isVerified,
    );

    return toItemDTO(result);
  }
}
