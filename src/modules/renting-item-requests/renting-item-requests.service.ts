import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

import { PrismaService } from '../prisma/prisma.service';
import {
  Item,
  RentingItemRequest,
  RentingItemRequestStatus,
  User,
} from '@prisma/client';
import { RentingItemRequestInputDTO } from './renting-item-request-input.dto';
import { RentingItemRequestDTO } from './renting-item-request.dto';
import { PaginationDTO } from '../../models';
import { UsersService } from '../users/users.service';
import { Permission } from './permission.enum';

const WEEK_DAY = 7;
const MONTH_DAY = 30;

enum RentingItemRequestUserType {
  Owner = 'owner',
  Lender = 'lender',
}

function toRentingItemRequestDTO(
  rentingItemRequest: RentingItemRequest,
  permissions: Permission[],
  ownerUserDetail?: User,
  lenderUserDetail?: User,
): RentingItemRequestDTO {
  const cachedInfo = JSON.parse(rentingItemRequest.rentingItemCachedInfo);
  if (cachedInfo?.images) {
    cachedInfo.images = JSON.parse(cachedInfo.images);
  }

  return {
    ...rentingItemRequest,
    fromDate: rentingItemRequest.fromDate.getTime(),
    toDate: rentingItemRequest.toDate.getTime(),
    createdDate: rentingItemRequest.createdDate.getTime(),
    updatedDate: rentingItemRequest.updatedDate.getTime(),
    rentingItemCachedInfo: cachedInfo,
    ownerUserDetail,
    lenderUserDetail,
    permissions,
  };
}

@Injectable()
export class RentingItemRequetsService {
  constructor(
    private prismaService: PrismaService,
    private userService: UsersService,
  ) {}

  calcTotalAmount(
    item: Item,
    fromDate: number,
    toDate: number,
    quantity: number,
  ): number {
    const diffDay = Math.abs(moment(fromDate).diff(moment(toDate), 'day'));

    const numberOfWeek = parseInt((diffDay / WEEK_DAY).toString());
    if (numberOfWeek >= 1 && item.rentPricePerWeek > 0) {
      const days = diffDay % WEEK_DAY;

      return (
        quantity *
        (numberOfWeek * item.rentPricePerWeek + days * item.rentPricePerDay)
      );
    }

    const numberOfMonth = parseInt((diffDay / MONTH_DAY).toString());
    if (numberOfMonth >= 1 && item.rentPricePerMonth > 0) {
      const days = diffDay % MONTH_DAY;

      return (
        quantity *
        (numberOfMonth * item.rentPricePerMonth + days * item.rentPricePerDay)
      );
    }

    return quantity * (diffDay * item.rentPricePerDay);
  }

  async createNewRequestForUser(
    data: RentingItemRequestInputDTO,
    ownerUserId: string,
  ): Promise<RentingItemRequestDTO> {
    const { itemId, fromDate, toDate } = data;
    const item = await this.prismaService.item.findOne({
      where: { id: itemId },
    });
    const totalAmount = await this.calcTotalAmount(item, fromDate, toDate, 1);

    const newItem = await this.prismaService.rentingItemRequest.create({
      data: {
        rentingItem: {
          connect: {
            id: itemId,
          },
        },
        rentingItemCachedInfo: JSON.stringify({
          name: item.name,
          images: item.images,
          rentPricePerDay: item.rentPricePerDay,
          rentPricePerWeek: item.rentPricePerWeek,
          rentPricePerMonth: item.rentPricePerMonth,
          currencyCode: item.currencyCode,
        }),
        totalAmount,
        actualTotalAmount: 0,
        rentTotalQuantity: 1,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        status: RentingItemRequestStatus.New,
        ownerUserId,
        lenderUserId: item.ownerUserId,
        isDeleted: false,
        updatedBy: item.ownerUserId,
      },
    });
    const permissions = this.getPermissions(newItem, ownerUserId);

    return toRentingItemRequestDTO(newItem, permissions);
  }

  async findAllRequestFromUser({
    offset = 0,
    limit = 10,
    ownerUserId,
    includes,
    sortByFields,
    userType = RentingItemRequestUserType.Owner,
  }): Promise<PaginationDTO<RentingItemRequest>> {
    const mandatoryWhere: any = {
      isDeleted: false,
    };

    if (userType === RentingItemRequestUserType.Owner) {
      mandatoryWhere.ownerUserId = ownerUserId;
    } else {
      mandatoryWhere.lenderUserId = ownerUserId;
    }

    const validIncludeMap = {
      rentingItem: true,
    };

    const include = (includes || []).reduce((result, cur) => {
      if (validIncludeMap[cur]) {
        result[cur] = true;
      }
      return result;
    }, {});

    const findCondition: any = {
      where: mandatoryWhere,
      skip: offset,
      take: limit,
    };

    if (Object.keys(include).length) {
      findCondition.include = include;
    }

    const validSortBy = {
      fromDate: true,
      toDate: true,
      createdDate: true,
      updatedDated: true,
      status: true,
    };

    if (sortByFields && sortByFields.length) {
      sortByFields.forEach((sortBy) => {
        const sortByChunk = sortBy.split(':');
        if (validSortBy[sortByChunk[0]]) {
          findCondition.orderBy = [
            {
              [sortByChunk[0]]: sortByChunk[1] || 'asc',
            }
          ];
        }
      });
    } else {
      findCondition.orderBy = [
        {
          createdDate: 'desc',
        },
        {
          updatedDate: 'desc',
        },
      ];
    }

    const items = await this.prismaService.rentingItemRequest.findMany(
      findCondition,
    );
    const count = await this.prismaService.rentingItemRequest.count({
      where: findCondition.where,
    });

    return {
      items,
      total: count,
      offset,
      limit,
    };
  }

  async findAllRequestFromOwner({
    offset = 0,
    limit = 10,
    ownerUserId,
    includes,
    sortByFields,
  }): Promise<PaginationDTO<RentingItemRequestDTO>> {
    const dbResults = await this.findAllRequestFromUser({
      offset,
      limit,
      ownerUserId,
      includes,
      sortByFields,
      userType: RentingItemRequestUserType.Owner,
    });
    const finalItems: RentingItemRequestDTO[] = [];

    for (let i = 0; i < dbResults.items.length; i++) {
      const item = dbResults.items[i] as RentingItemRequest;
      const permissions = this.getPermissions(item, ownerUserId);
      const newItem = toRentingItemRequestDTO(item, permissions);

      if (
        includes?.includes('lenderUserDetail') &&
        permissions.includes(Permission.VIEW_LENDER_INFO)
      ) {
        newItem.lenderUserDetail = await this.userService.getUserById(
          item.lenderUserId,
        );
      }

      finalItems.push(newItem);
    }

    return {
      ...dbResults,
      items: finalItems,
    };
  }

  async findAllRequestToLender({
    offset = 0,
    limit = 10,
    lenderUserId,
    includes,
    sortByFields,
  }): Promise<PaginationDTO<RentingItemRequestDTO>> {
    const dbResults = await this.findAllRequestFromUser({
      offset,
      limit,
      ownerUserId: lenderUserId,
      includes,
      sortByFields,
      userType: RentingItemRequestUserType.Lender,
    });
    const finalItems: RentingItemRequestDTO[] = [];

    for (let i = 0; i < dbResults.items.length; i++) {
      const item = dbResults.items[i] as RentingItemRequest;
      const permissions = this.getPermissions(item, lenderUserId);
      const newItem = toRentingItemRequestDTO(item, permissions);

      if (
        includes?.includes('ownerUserDetail') &&
        permissions.includes(Permission.VIEW_REQUEST_RENT_OWNER_INFO)
      ) {
        newItem.ownerUserDetail = await this.userService.getUserById(
          item.ownerUserId,
        );
      }

      finalItems.push(newItem);
    }

    return {
      ...dbResults,
      items: finalItems,
    };
  }

  public async cancelRequest(id: string, byUserId: string): Promise<RentingItemRequestDTO> {
    const requestItem = await this.prismaService.rentingItemRequest.findOne({ where: { id } })
    const permissions = this.getPermissions(requestItem, byUserId)

    if (permissions.includes(Permission.CANCEL)) {
      return this.changeRentingItemRequestStatus(id, RentingItemRequestStatus.Cancelled, byUserId)
    }

    throw new Error('Not Authorize')
  }

  public async approveRequest(id: string, byUserId: string): Promise<RentingItemRequestDTO> {
    const requestItem = await this.prismaService.rentingItemRequest.findOne({ where: { id } })
    const permissions = this.getPermissions(requestItem, byUserId)

    if (permissions.includes(Permission.APPROVE)) {
      return this.changeRentingItemRequestStatus(id, RentingItemRequestStatus.Approved, byUserId)
    }

    throw new Error('Not Authorize')
  }

  public async declineRequest(id: string, byUserId: string): Promise<RentingItemRequestDTO> {
    const requestItem = await this.prismaService.rentingItemRequest.findOne({ where: { id } })
    const permissions = this.getPermissions(requestItem, byUserId)

    if (permissions.includes(Permission.DECLINE)) {
      return this.changeRentingItemRequestStatus(id, RentingItemRequestStatus.Declined, byUserId)
    }

    throw new Error('Not Authorize')
  }

  public async startRequest(id: string, byUserId: string): Promise<RentingItemRequestDTO> {
    const requestItem = await this.prismaService.rentingItemRequest.findOne({ where: { id } })
    const permissions = this.getPermissions(requestItem, byUserId)

    if (permissions.includes(Permission.START)) {
      return this.changeRentingItemRequestStatus(id, RentingItemRequestStatus.InProgress, byUserId)
    }

    throw new Error('Not Authorize')
  }

  public async completeRequest(id: string, byUserId: string): Promise<RentingItemRequestDTO> {
    const requestItem = await this.prismaService.rentingItemRequest.findOne({ where: { id } })
    const permissions = this.getPermissions(requestItem, byUserId)

    if (permissions.includes(Permission.COMPLETE)) {
      return this.changeRentingItemRequestStatus(id, RentingItemRequestStatus.Completed, byUserId)
    }

    throw new Error('Not Authorize')
  }

  private async changeRentingItemRequestStatus(id: string, status: RentingItemRequestStatus, updatedBy: string): Promise<RentingItemRequestDTO> {
    const rentingRequest = await this.prismaService.rentingItemRequest.update({
      where: {
        id
      },
      data: {
        status,
        updatedBy,
        updatedDate: new Date()
      }
    })

    const permissions = this.getPermissions(rentingRequest, updatedBy);
    return toRentingItemRequestDTO(rentingRequest, permissions)
  }

  private getPermissions(
    rentingItemRequest: RentingItemRequest,
    userId: string,
  ): Permission[] {
    const permissions = [];

    const isCurrentUserIsOwnerOfThisRequest =
      rentingItemRequest.ownerUserId === userId;
    if (isCurrentUserIsOwnerOfThisRequest) {
      if (rentingItemRequest.status === RentingItemRequestStatus.New) {
        permissions.push(Permission.CANCEL);
      }

      if (rentingItemRequest.status === RentingItemRequestStatus.Approved) {
        permissions.push(Permission.START);
        permissions.push(Permission.VIEW_LENDER_INFO);
      }
    }

    const isCurrentUserIsLenderOfThisRequest =
      rentingItemRequest.lenderUserId === userId;
    if (isCurrentUserIsLenderOfThisRequest) {
      permissions.push(Permission.VIEW_REQUEST_RENT_OWNER_INFO);

      if (rentingItemRequest.status === RentingItemRequestStatus.New) {
        permissions.push(Permission.DECLINE);
        permissions.push(Permission.APPROVE);
      }

      if (rentingItemRequest.status === RentingItemRequestStatus.InProgress) {
        permissions.push(Permission.COMPLETE);
      }
    }

    if (
      isCurrentUserIsLenderOfThisRequest ||
      isCurrentUserIsOwnerOfThisRequest
    ) {
      permissions.push(Permission.ADD_COMMENT);
    }

    return permissions;
  }
}
