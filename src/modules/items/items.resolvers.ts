import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'

import {
  Item
} from '@prisma/client';
import { ItemsService } from './items.service'
import { ItemUserInputDTO } from './item-user-input.dto'
import { ItemDTO } from './item.dto'
import {
  GuardUserPayload,
  CurrentUser,
  GqlAuthGuard
} from '../auth'
import { PaginationDTO } from '../../models'

function toItemDTO(item: Item): ItemDTO {
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
  constructor(private readonly itemService: ItemsService) {}

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async listingNewItem(
    @CurrentUser() user: GuardUserPayload,
    @Args('itemData') itemData: ItemUserInputDTO,
  ): Promise<ItemDTO> {
    return new Promise((resolve, reject) => {
      this.itemService.createItemForUser(itemData, user.userId)
        .then((item) => {
          resolve(toItemDTO(item))
        })
        .catch(reject)
    })
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async feed(
    @Args('search') search: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number
  ): Promise<PaginationDTO<ItemDTO>> {
    const actualLimit = limit && limit > 100 ? 100 : limit
    const result = await this.itemService.findAllAvailablesItem(search, offset, actualLimit)

    return {
      items: result.items.map(toItemDTO),
      total: result.total
    }
  }
}
