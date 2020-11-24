import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'

import {
  Item
} from '@prisma/client';
import { RentingItemRequetsService } from './renting-item-requests.service'
import { RentingItemRequestInputDTO } from './renting-item-request-input.dto'
import { RentingItemRequestDTO } from './renting-item-request.dto'
import {
  GuardUserPayload,
  CurrentUser,
  GqlAuthGuard
} from '../auth'
import { PaginationDTO } from '../../models'

@Resolver('RentingItemRequest')
export class RentingItemRequestsResolvers {
  constructor(private readonly rentingItemRequestService: RentingItemRequetsService) {}

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async newRequest(
    @CurrentUser() user: GuardUserPayload,
    @Args('requestData') requestData: RentingItemRequestInputDTO,
  ): Promise<RentingItemRequestDTO> {
    return this.rentingItemRequestService.createNewRequestForUser(requestData, user.id)
  }

  // @Query()
  // async feed(
  //   @Args('query') query: {
  //     search: string,
  //     offset: number,
  //     limit: number,
  //     areaId: string,
  //     categoryId: string,
  //     includes: string[]
  //   }
  // ): Promise<PaginationDTO<ItemDTO>> {
  //   const { search, offset, limit, areaId, categoryId, includes } = query || {}
  //   const actualLimit = limit && limit > 100 ? 100 : limit
  //   const result = await this.itemService.findAllAvailablesItem({
  //     searchValue: search,
  //     offset,
  //     limit: actualLimit,
  //     areaId,
  //     categoryId,
  //     includes
  //   })

  //   return {
  //     items: result.items.map(toItemDTO),
  //     total: result.total,
  //     offset: offset || 0,
  //     limit: actualLimit
  //   }
  // }

  // @Query()
  // async feedDetailBySlug(
  //   @Args('slug') slug: string,
  //   @Args('includes') includes: string[],
  // ): Promise<ItemDTO> {
  //   const item = await this.itemService.findOneAvailableBySlug(slug, includes)

  //   return toItemDTO(item)
  // }
}
