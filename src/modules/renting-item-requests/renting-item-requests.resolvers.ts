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

  @Query()
  @UseGuards(GqlAuthGuard)
  async findAllRequestFromMe(
    @CurrentUser() user: GuardUserPayload,
    @Args('query') query: {
      offset: number,
      limit: number,
      includes: string[],
      sortByFields: string[]
    },
  ): Promise<PaginationDTO<RentingItemRequestDTO>> {
    const { offset, limit, includes, sortByFields } = query || {};

    return this.rentingItemRequestService.findAllRequestFromOwner({
      offset,
      limit,
      ownerUserId: user.id,
      includes,
      sortByFields
    })
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async findAllRequestToMe(
    @CurrentUser() user: GuardUserPayload,
    @Args('query') query: {
      offset: number,
      limit: number,
      includes: string[],
      sortByFields: string[]
    },
  ): Promise<PaginationDTO<RentingItemRequestDTO>> {
    const { offset, limit, includes, sortByFields } = query || {};

    return this.rentingItemRequestService.findAllRequestToLender({
      offset,
      limit,
      lenderUserId: user.id,
      includes,
      sortByFields
    })
  }
}
