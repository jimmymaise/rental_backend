import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'

import {
  RentingItemRequestActivity
} from '@prisma/client'
import { RentingItemRequetsService } from './renting-item-requests.service'
import { RentingItemRequestInputDTO } from './renting-item-request-input.dto'
import { RentingItemRequestDTO } from './renting-item-request.dto'
import {
  GuardUserPayload,
  CurrentUser,
  GqlAuthGuard
} from '../auth'
import { PaginationDTO } from '../../models'
import { StoragePublicDTO } from '../storages/storage-public.dto'
import { RentingItemRequestActivityDTO } from './renting-item-request-activity.dto'

interface UpdateItemRequestStatusModel {
  rentingRequestId: string
  comment?: string
  files?: StoragePublicDTO[]
}

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
    @Args('data') data: UpdateItemRequestStatusModel
  ): Promise<RentingItemRequestDTO> {
    return this.rentingItemRequestService.cancelRequest({
      id: data.rentingRequestId,
      comment: data.comment,
      files: data.files,
      updatedBy: user.id
    })
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async approveRequest(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: UpdateItemRequestStatusModel
  ): Promise<RentingItemRequestDTO> {
    return this.rentingItemRequestService.approveRequest({
      id: data.rentingRequestId,
      comment: data.comment,
      files: data.files,
      updatedBy: user.id
    })
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async declineRequest(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: UpdateItemRequestStatusModel
  ): Promise<RentingItemRequestDTO> {
    return this.rentingItemRequestService.declineRequest({
      id: data.rentingRequestId,
      comment: data.comment,
      files: data.files,
      updatedBy: user.id
    })
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async startRequest(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: UpdateItemRequestStatusModel
  ): Promise<RentingItemRequestDTO> {
    return this.rentingItemRequestService.startRequest({
      id: data.rentingRequestId,
      comment: data.comment,
      files: data.files,
      updatedBy: user.id
    })
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async completeRequest(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: UpdateItemRequestStatusModel
  ): Promise<RentingItemRequestDTO> {
    return this.rentingItemRequestService.completeRequest({
      id: data.rentingRequestId,
      comment: data.comment,
      files: data.files,
      updatedBy: user.id
    })
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async commentOnRequest(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: UpdateItemRequestStatusModel
  ): Promise<RentingItemRequestActivityDTO> {
    return this.rentingItemRequestService.comment({
      id: data.rentingRequestId,
      comment: data.comment,
      files: data.files,
      updatedBy: user.id
    })
  }
}
