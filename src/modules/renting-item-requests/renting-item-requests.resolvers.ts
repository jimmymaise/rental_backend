import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'

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

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async cancelRequest(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string
  ): Promise<RentingItemRequestDTO> {
    return this.rentingItemRequestService.cancelRequest(id, user.id)
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async approveRequest(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string
  ): Promise<RentingItemRequestDTO> {
    return this.rentingItemRequestService.approveRequest(id, user.id)
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async declineRequest(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string
  ): Promise<RentingItemRequestDTO> {
    return this.rentingItemRequestService.declineRequest(id, user.id)
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async startRequest(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string
  ): Promise<RentingItemRequestDTO> {
    return this.rentingItemRequestService.startRequest(id, user.id)
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async completeRequest(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string
  ): Promise<RentingItemRequestDTO> {
    return this.rentingItemRequestService.completeRequest(id, user.id)
  }
}
