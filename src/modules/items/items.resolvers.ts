import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { ItemsService } from './items.service'
import { ItemUserInputDTO } from './item-user-input.dto'
import { ItemDTO } from './item.dto'
import {
  GuardUserPayload,
  CurrentUser,
  GqlAuthGuard
} from '../auth';

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
          resolve({
            ...item,
            createdDate: item.createdDate.getTime(),
            unavailableForRentDays: item.unavailableForRentDays.map((data) => data.getTime()),
            images: item.images && item.images.length ? JSON.parse(item.images) : [],
            checkBeforeRentDocuments: item.checkBeforeRentDocuments && item.checkBeforeRentDocuments.length ? JSON.parse(item.checkBeforeRentDocuments) : [],
            keepWhileRentingDocuments: item.keepWhileRentingDocuments && item.keepWhileRentingDocuments.length ? JSON.parse(item.keepWhileRentingDocuments) : []
          } as any)
        })
        .catch(reject)
    })
  }
}
