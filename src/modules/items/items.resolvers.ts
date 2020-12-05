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
    private readonly itemService: ItemsService,
    private readonly userItemService: UserItemsService
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
  async feed(
    @Args('query') query: {
      search: string,
      offset: number,
      limit: number,
      areaId: string,
      categoryId: string,
      includes: string[]
    }
  ): Promise<PaginationDTO<ItemDTO>> {
    const { search, offset, limit, areaId, categoryId, includes } = query || {}
    const actualLimit = limit && limit > 100 ? 100 : limit
    const result = await this.itemService.findAllAvailablesItem({
      searchValue: search,
      offset,
      limit: actualLimit,
      areaId,
      categoryId,
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
  async feedDetailBySlug(
    @Args('slug') slug: string,
    @Args('includes') includes: string[],
  ): Promise<ItemDTO> {
    const item = await this.itemService.findOneAvailableBySlug(slug, includes)

    return toItemDTO(item)
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
