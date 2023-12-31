import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';

import {
  RentingItemRequetsService,
  CalcAmountParam,
  CalcAmountResult,
} from './renting-item-requests.service';
import { RentingItemRequestActivitiesService } from './renting-item-request-activities.service';
import { RentingItemRequestInputDTO } from './renting-item-request-input.dto';
import { RentingItemRequestDTO } from './renting-item-request.dto';
import { GuardUserPayload, CurrentUser, GqlAuthGuard } from '../auth';
import { OffsetPaginationDTO } from '../../models';
import { StoragePublicDTO } from '../storages/storage-public.dto';
import { RentingItemRequestActivityDTO } from './renting-item-request-activity.dto';
import { Permission } from '@modules/auth/permission/permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';

interface UpdateItemRequestStatusModel {
  rentingRequestId: string;
  comment?: string;
  files?: StoragePublicDTO[];
  actualTotalAmount?: number;
}

@Resolver('RentingItemRequest')
export class RentingItemRequestsResolvers {
  constructor(
    private rentingItemRequestService: RentingItemRequetsService,
    private rentingItemRequestActivityService: RentingItemRequestActivitiesService,
  ) {}

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async newRequest(
    @CurrentUser() user: GuardUserPayload,
    @Args('requestData') requestData: RentingItemRequestInputDTO,
  ): Promise<RentingItemRequestDTO> {
    return this.rentingItemRequestService.createNewRequestForUser(
      requestData,
      user.id,
    );
  }

  // @Query()
  // @UseGuards(GqlAuthGuard)
  // async findAllRequestFromMe(
  //   @CurrentUser() user: GuardUserPayload,
  //   @Args('query') query: {
  //     offset: number,
  //     limit: number,
  //     includes: string[],
  //     sortByFields: string[]
  //   },
  // ): Promise<OffsetPaginationDTO<RentingItemRequestDTO>> {
  //   const { offset, limit, includes, sortByFields } = query || {};

  //   return this.rentingItemRequestService.findAllRequestFromOwner({
  //     offset,
  //     limit,
  //     ownerUserId: user.id,
  //     includes,
  //     sortByFields
  //   })
  // }

  // @Query()
  // @UseGuards(GqlAuthGuard)
  // async findAllRequestToMe(
  //   @CurrentUser() user: GuardUserPayload,
  //   @Args('query') query: {
  //     offset: number,
  //     limit: number,
  //     includes: string[],
  //     sortByFields: string[]
  //   },
  // ): Promise<OffsetPaginationDTO<RentingItemRequestDTO>> {
  //   const { offset, limit, includes, sortByFields } = query || {};

  //   return this.rentingItemRequestService.findAllRequestToLender({
  //     offset,
  //     limit,
  //     lenderUserId: user.id,
  //     includes,
  //     sortByFields
  //   })
  // }
  @Query()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async findAllRequest(
    @CurrentUser() user: GuardUserPayload,
    @Args('query')
    query: {
      offset: number;
      limit: number;
      includes: string[];
      sortByFields: string[];
    },
  ): Promise<OffsetPaginationDTO<RentingItemRequestDTO>> {
    const { offset, limit, includes, sortByFields } = query || {};

    return this.rentingItemRequestService.findAllRequestFromUser({
      offset,
      limit,
      ownerUserId: user.id,
      includes,
      sortByFields,
    });
  }

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async cancelRequest(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: UpdateItemRequestStatusModel,
  ): Promise<RentingItemRequestDTO> {
    return this.rentingItemRequestService.cancelRequest({
      id: data.rentingRequestId,
      comment: data.comment,
      files: data.files,
      updatedBy: user.id,
    });
  }

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async approveRequest(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: UpdateItemRequestStatusModel,
  ): Promise<RentingItemRequestDTO> {
    return this.rentingItemRequestService.approveRequest({
      id: data.rentingRequestId,
      comment: data.comment,
      files: data.files,
      actualTotalAmount: data.actualTotalAmount,
      updatedBy: user.id,
    });
  }

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async declineRequest(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: UpdateItemRequestStatusModel,
  ): Promise<RentingItemRequestDTO> {
    return this.rentingItemRequestService.declineRequest({
      id: data.rentingRequestId,
      comment: data.comment,
      files: data.files,
      updatedBy: user.id,
    });
  }

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async startRequest(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: UpdateItemRequestStatusModel,
  ): Promise<RentingItemRequestDTO> {
    return this.rentingItemRequestService.startRequest({
      id: data.rentingRequestId,
      comment: data.comment,
      files: data.files,
      updatedBy: user.id,
    });
  }

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async completeRequest(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: UpdateItemRequestStatusModel,
  ): Promise<RentingItemRequestDTO> {
    return this.rentingItemRequestService.completeRequest({
      id: data.rentingRequestId,
      comment: data.comment,
      files: data.files,
      updatedBy: user.id,
    });
  }

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async commentOnRequest(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: UpdateItemRequestStatusModel,
  ): Promise<RentingItemRequestActivityDTO> {
    return this.rentingItemRequestService.comment({
      id: data.rentingRequestId,
      comment: data.comment,
      files: data.files,
      updatedBy: user.id,
    });
  }

  @Query()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async findAllActivityRequest(
    @CurrentUser() user: GuardUserPayload,
    @Args('requestId') requestId: string,
    @Args('query')
    query: {
      offset: number;
      limit: number;
    },
  ): Promise<OffsetPaginationDTO<RentingItemRequestActivityDTO>> {
    const { offset, limit } = query || {};
    return this.rentingItemRequestActivityService.findAllActivityFromRequest({
      userId: user.id,
      offset,
      limit,
      rentingRequestId: requestId,
    });
  }

  @Query()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  calcAmount(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: CalcAmountParam,
  ): CalcAmountResult {
    return this.rentingItemRequestService.calcAmount(data);
  }
}
