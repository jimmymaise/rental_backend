import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'

import {
  Item
} from '@prisma/client';
import { ItemsService } from './items.service'
import { UserItemsService } from './user-items.service'
import { ItemUserInputDTO } from './item-user-input.dto'
import { ItemDTO } from './item.dto'
import {
  GuardUserPayload,
  CurrentUser,
  GqlAuthGuard
} from '../auth'
import { PaginationDTO } from '../../models'
import { UsersService } from '../users/users.service'
import { SearchKeywordService } from '../search-keyword/search-keyword.service'
import { WishingItemsService } from '../wishing-items/wishing-items.service'

function toItemDTO(item: Item): ItemDTO {
  if (!item) {
    return null
  }

  return {
    ...item,
    createdDate: item.createdDate.getTime(),
    unavailableForRentDays: item.unavailableForRentDays.map((data) => data.getTime()),
    images: item.images && item.images.length ? JSON.parse(item.images) : [],
    checkBeforeRentDocuments: item.checkBeforeRentDocuments && item.checkBeforeRentDocuments.length ? JSON.parse(item.checkBeforeRentDocuments) : [],
    keepWhileRentingDocuments: item.keepWhileRentingDocuments && item.keepWhileRentingDocuments.length ? JSON.parse(item.keepWhileRentingDocuments) : []
  }
}

@Resolver('Item')
export class ItemsResolvers {
  constructor(
    private itemService: ItemsService,
    private userItemService: UserItemsService,
    private usersService: UsersService,
    private searchKeywordService: SearchKeywordService,
    private wishingItemService: WishingItemsService
  ) {}

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async listingNewItem(
    @CurrentUser() user: GuardUserPayload,
    @Args('itemData') itemData: ItemUserInputDTO,
  ): Promise<ItemDTO> {
    return new Promise((resolve, reject) => {
      this.itemService.createItemForUser(itemData, user.id)
        .then((item) => {
          resolve(toItemDTO(item))
        })
        .catch(reject)
    })
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async feed(
    @CurrentUser() user: GuardUserPayload,
    @Args('query') query: {
      search: string,
      offset: number,
      limit: number,
      areaId: string,
      categoryId: string,
      includes: string[],
      sortByFields: string[]
      checkWishlist?: boolean
    }
  ): Promise<PaginationDTO<ItemDTO>> {
    const { search, offset, limit, areaId, categoryId, includes, sortByFields, checkWishlist } = query || {}
    const actualLimit = limit && limit > 100 ? 100 : limit

    if (search && search.length) {
      await this.searchKeywordService.increaseKeywordCount(search)
    }

    const result = await this.itemService.findAllAvailablesItem({
      searchValue: search,
      offset,
      limit: actualLimit,
      areaId,
      categoryId,
      includes,
      sortByFields
    })

    const items = []

    for (let i = 0; i < result.items.length; i++) {
      const newItem = toItemDTO(result.items[i])

      if (result.items[i].ownerUserId) {
        newItem.createdBy = await this.usersService.getUserDetailData(result.items[i].ownerUserId)
      }

      if (user && checkWishlist) {
        newItem.isInMyWishList = await this.wishingItemService.findUnique(user.id, newItem.id) !== null
      }

      items.push(newItem)
    }

    return {
      items,
      total: result.total,
      offset: offset || 0,
      limit: actualLimit
    }
  }

  @Query()
  async feedDetailBySlug(
    @Args('slug') slug: string,
    @Args('includes') includes: string[],
  ): Promise<ItemDTO> {
    const item = await this.itemService.findOneAvailableBySlug(slug, includes)
    const enhancedItem = toItemDTO(item)

    if (item.ownerUserId) {
      enhancedItem.createdBy = await this.usersService.getUserDetailData(item.ownerUserId)
    }

    return enhancedItem
  }

  // #### For Me

  @Query()
  @UseGuards(GqlAuthGuard)
  async feedMyItems(
    @CurrentUser() user: GuardUserPayload,
    @Args('query') query: {
      search: string,
      offset: number,
      limit: number,
      includes: string[]
    }
  ): Promise<PaginationDTO<ItemDTO>> {
    const { search, offset, limit, includes } = query || {}
    const actualLimit = limit && limit > 100 ? 100 : limit
    const result = await this.userItemService.findAllItemsCreatedByUser({
      createdBy: user.id,
      searchValue: search,
      offset,
      limit: actualLimit,
      includes
    })

    return {
      items: result.items.map(toItemDTO),
      total: result.total,
      offset: offset || 0,
      limit: actualLimit
    }
  }

  @Query()
  async feedUserPublicItems(
    @CurrentUser() user: GuardUserPayload,
    @Args('userId') userId: string,
    @Args('query') query: {
      search: string,
      offset: number,
      limit: number,
      includes: string[]
    }
  ): Promise<PaginationDTO<ItemDTO>> {
    const { search, offset, limit, includes } = query || {}
    const actualLimit = limit && limit > 100 ? 100 : limit
    const result = await this.userItemService.findAllPublicItemsCreatedByUser({
      createdBy: userId,
      searchValue: search,
      offset,
      limit: actualLimit,
      includes
    })

    const items = []
    for (let i = 0; i < result.items.length; i++) {
      const newItem = toItemDTO(result.items[i])

      if (result.items[i].ownerUserId) {
        newItem.createdBy = await this.usersService.getUserDetailData(result.items[i].ownerUserId)
      }

      items.push(newItem)
    }

    return {
      items,
      total: result.total,
      offset: offset || 0,
      limit: actualLimit
    }
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async feedMyItemDetail(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
    @Args('includes') includes: string[],
  ): Promise<ItemDTO> {
    const item = await this.userItemService.findOneDetailForEdit(id, user.id, includes)

    return toItemDTO(item)
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updateMyItem(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
    @Args('itemData') itemData: ItemUserInputDTO,
  ): Promise<ItemDTO> {
    return new Promise((resolve, reject) => {
      this.userItemService.updateMyItem(id, user.id, itemData)
        .then((item) => {
          resolve(toItemDTO(item))
        })
        .catch(reject)
    })
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async deleteMyItem(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
  ): Promise<ItemDTO> {
    return new Promise((resolve, reject) => {
      this.userItemService.softDeleteMyItem(id, user.id)
        .then((item) => {
          if (!item) {
            throw new Error('Item is not existing!')
          }

          resolve(toItemDTO(item))
        })
        .catch(reject)
    })
  }
}
