import { Injectable } from '@nestjs/common';
import moment from 'moment';

import { PrismaService } from '../prisma/prisma.service';
import {
  Item,
  RentingItemRequest,
  RentingItemRequestActivity,
} from '@prisma/client';
import { RentingItemRequestInputDTO } from './renting-item-request-input.dto';
import { RentingItemRequestDTO } from './renting-item-request.dto';
import {
  OffsetPaginationDTO,
  RentingItemRequestStatus,
  RentingItemRequestActivityType,
} from '@app/models';
import { UsersService } from '../users/users.service';
import { Permission } from './permission.enum';
import { StoragePublicDTO } from '../storages/storage-public.dto';
import { RentingItemRequestActivityDTO } from './renting-item-request-activity.dto';
import { ItemDTO } from '../items/item.dto';
import { NotificationService } from '../notification/notification.service';

const WEEK_DAY = 7;
const MONTH_DAY = 30;

enum RentingItemRequestUserType {
  Owner = 'owner',
  Lender = 'lender',
}

interface ChangeItemRequestStatusModel {
  id: string;
  status?: RentingItemRequestStatus;
  updatedBy: string;
  comment?: string;
  files?: StoragePublicDTO[];
  actualTotalAmount?: number;
}

const RequestActivityTypeMap = {
  [RentingItemRequestStatus.Declined]: RentingItemRequestActivityType.Declined,
  [RentingItemRequestStatus.Approved]: RentingItemRequestActivityType.Approved,
  [RentingItemRequestStatus.Completed]:
    RentingItemRequestActivityType.Completed,
  [RentingItemRequestStatus.Cancelled]:
    RentingItemRequestActivityType.Cancelled,
  [RentingItemRequestStatus.InProgress]:
    RentingItemRequestActivityType.InProgress,
};

function toItemDTO(item: Item): ItemDTO {
  if (!item) {
    return null;
  }

  return {
    ...item,
    createdDate: item.createdDate?.getTime
      ? item.createdDate.getTime()
      : new Date(item.createdDate).getTime(), // Parse for RedisCache
    updatedDate: item.updatedDate?.getTime
      ? item.updatedDate.getTime()
      : new Date(item.updatedDate).getTime(), // Parse for RedisCache
    unavailableForRentDays: item.unavailableForRentDays.map((data) =>
      data.getTime(),
    ),
    images: item.images as any,
    checkBeforeRentDocuments: item.checkBeforeRentDocuments as any,
    keepWhileRentingDocuments: item.keepWhileRentingDocuments as any,
  };
}

function toRentingItemRequestDTO(
  rentingItemRequest: RentingItemRequest,
  permissions: Permission[],
): RentingItemRequestDTO {
  return {
    ...rentingItemRequest,
    rentingItem: (rentingItemRequest as any).rentingItem
      ? toItemDTO((rentingItemRequest as any).rentingItem)
      : null,
    fromDate: rentingItemRequest.fromDate.getTime(),
    toDate: rentingItemRequest.toDate.getTime(),
    createdDate: rentingItemRequest.createdDate.getTime(),
    updatedDate: rentingItemRequest.updatedDate.getTime(),
    permissions,
  };
}

function toRentingItemRequestActivityDTO(
  data: RentingItemRequestActivity,
): RentingItemRequestActivityDTO {
  return {
    id: data.id,
    rentingItemRequestId: data.rentingItemRequestId,
    comment: data.comment,
    type: data.type,
    files: data.files as any,
    createdDate: data.createdDate.getTime(),
    updatedDate: data.updatedDate.getTime(),
  };
}

export interface CalcAmountResult {
  fromDate: number;
  toDate: number;
  rentPricePerDay: number;
  rentPricePerWeek: number;
  rentPricePerMonth: number;
  quantity: number;
  countOfDay: number;
  countOfWeek: number;
  countOfMonth: number;
  totalAmount: number;
  dayAmount: number;
  weekAmount: number;
  monthAmount: number;
}

export interface CalcAmountParam {
  fromDate: number;
  toDate: number;
  rentPricePerDay: number;
  rentPricePerWeek: number;
  rentPricePerMonth: number;
  quantity: number;
}

@Injectable()
export class RentingItemRequetsService {
  constructor(
    private prismaService: PrismaService,
    private notificationService: NotificationService,
    private userService: UsersService,
  ) {}

  calcAmount({
    rentPricePerDay,
    rentPricePerWeek,
    rentPricePerMonth,
    fromDate,
    toDate,
    quantity,
  }: CalcAmountParam): CalcAmountResult {
    const result: CalcAmountResult = {
      fromDate,
      toDate,
      rentPricePerDay,
      rentPricePerWeek,
      rentPricePerMonth,
      quantity,
      countOfDay: 0,
      countOfWeek: 0,
      countOfMonth: 0,
      totalAmount: 0,
      dayAmount: 0,
      weekAmount: 0,
      monthAmount: 0,
    };

    let remainingDays = Math.abs(moment(fromDate).diff(moment(toDate), 'day'));
    if (rentPricePerMonth > 0) {
      const numberOfMonth = parseInt((remainingDays / MONTH_DAY).toString());
      if (numberOfMonth >= 1) {
        remainingDays = remainingDays % MONTH_DAY;

        result.countOfMonth = numberOfMonth;
        result.monthAmount = result.countOfMonth * result.rentPricePerMonth;
      }
    }

    if (rentPricePerWeek > 0) {
      const numberOfWeek = parseInt((remainingDays / WEEK_DAY).toString());

      if (numberOfWeek >= 1) {
        remainingDays = remainingDays % WEEK_DAY;

        result.countOfWeek = numberOfWeek;
        result.weekAmount = result.countOfWeek * result.rentPricePerWeek;
      }
    }

    if (rentPricePerDay > 0 && remainingDays > 0) {
      result.countOfDay = remainingDays;
      result.dayAmount = result.countOfDay * result.rentPricePerDay;
    }

    result.totalAmount =
      result.dayAmount + result.weekAmount + result.monthAmount;

    return result;
  }

  async createNewRequestForUser(
    data: RentingItemRequestInputDTO,
    ownerUserId: string,
  ): Promise<RentingItemRequestDTO> {
    const { itemId, fromDate, toDate } = data;
    const item = await this.prismaService.item.findUnique({
      where: { id: itemId },
    });
    const amountData = this.calcAmount({
      rentPricePerDay: item.rentPricePerDay,
      rentPricePerWeek: item.rentPricePerWeek,
      rentPricePerMonth: item.rentPricePerMonth,
      fromDate,
      toDate,
      quantity: 1,
    });
    const totalAmount = amountData.totalAmount;
    const newItem = await this.prismaService.rentingItemRequest.create({
      data: {
        rentingItem: {
          connect: {
            id: itemId,
          },
        },
        totalAmount,
        hidePrice: item.hidePrice,
        rentPricePerDay: item.rentPricePerDay,
        rentPricePerWeek: item.rentPricePerWeek,
        rentPricePerMonth: item.rentPricePerMonth,
        actualTotalAmount: totalAmount,
        rentTotalQuantity: 1,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        status: RentingItemRequestStatus.New,
        ownerUser: {
          connect: {
            id: ownerUserId,
          },
        },
        lenderUser: {
          connect: {
            id: item.ownerUserId,
          },
        },
        isDeleted: false,
        updatedBy: item.ownerUserId,
      },
      include: {
        rentingItem: true,
      },
    });
    const permissions = this.getPermissions(newItem, ownerUserId);

    const result = toRentingItemRequestDTO(newItem, permissions);
    result.ownerUserDetail = await this.userService.getUserDetailData(
      newItem.ownerUserId,
    );
    // result.lenderUserDetail = await this.userService.getUserDetailData(newItem.lenderUserId)

    await this.notificationService.newRequestToUserNotification(
      item.ownerUserId,
      {
        id: result.id,
        itemName: result.rentingItem.name,
        itemId: result.itemId,
        fromDate,
        toDate,
        ownerRequestId: result.ownerUserId,
        lenderRequestId: result.lenderUserId,
      },
    );

    return result;
  }

  async findAllRequestFromUser({
    offset = 0,
    limit = 10,
    ownerUserId,
    includes,
    sortByFields,
    // userType = RentingItemRequestUserType.Owner,
  }): Promise<OffsetPaginationDTO<RentingItemRequestDTO>> {
    const mandatoryWhere: any = {
      AND: [
        {
          isDeleted: false,
        },
        {
          OR: [{ ownerUserId }, { lenderUserId: ownerUserId }],
        },
      ],
    };

    // if (userType === RentingItemRequestUserType.Owner) {
    //   mandatoryWhere.ownerUserId = ownerUserId;
    // } else {
    //   mandatoryWhere.lenderUserId = ownerUserId;
    // }

    const validIncludeMap = {
      rentingItem: true,
    };

    const include = (includes || []).reduce((result, cur) => {
      if (validIncludeMap[cur]) {
        if (cur === 'rentingItem') {
          result[cur] = {
            select: {
              id: true,
              name: true,
              slug: true,
              categories: true,
              areas: true,
              description: true,
              createdDate: true,
              ownerUserId: true,
              unavailableForRentDays: true,
              images: true,
              rentPricePerDay: true,
              rentPricePerMonth: true,
              rentPricePerWeek: true,
            },
          };
        } else {
          result[cur] = true;
        }
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
      updatedDate: true,
      status: true,
    };

    if (sortByFields && sortByFields.length) {
      sortByFields.forEach((sortBy) => {
        const sortByChunk = sortBy.split(':');
        if (validSortBy[sortByChunk[0]]) {
          findCondition.orderBy = [
            {
              [sortByChunk[0]]: sortByChunk[1] || 'asc',
            },
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

    const finalItems: RentingItemRequestDTO[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as RentingItemRequest;
      const permissions = this.getPermissions(item, ownerUserId);
      const newItem = toRentingItemRequestDTO(item, permissions);

      // if (
      //   includes?.includes('lenderUserDetail') &&
      //   permissions.includes(Permission.VIEW_LENDER_INFO)
      // ) {
      //   newItem.lenderUserDetail = await this.userService.getUserDetailData(item.lenderUserId)
      // }
      newItem.ownerUserDetail = await this.userService.getUserDetailData(
        item.ownerUserId,
      );
      newItem.lenderUserDetail = await this.userService.getUserDetailData(
        item.lenderUserId,
      );

      finalItems.push(newItem);
    }

    return {
      items: finalItems,
      total: count,
      offset,
      limit,
    };
  }

  public async cancelRequest(
    data: ChangeItemRequestStatusModel,
  ): Promise<RentingItemRequestDTO> {
    const requestItem = await this.prismaService.rentingItemRequest.findUnique({
      where: { id: data.id },
    });
    const permissions = this.getPermissions(requestItem, data.updatedBy);

    if (permissions.includes(Permission.CANCEL)) {
      const result = await this.changeRentingItemRequestStatus({
        ...data,
        status: RentingItemRequestStatus.Cancelled,
      });

      await this.notificationService.cancelRequestToUserNotification(
        result.lenderUserId,
        {
          id: result.id,
          itemName: result.rentingItem.name,
          itemId: result.itemId,
          fromDate: result.fromDate,
          toDate: result.toDate,
          ownerRequestId: result.ownerUserId,
          lenderRequestId: result.lenderUserId,
        },
      );

      return result;
    }

    throw new Error('Not Authorize');
  }

  public async approveRequest(
    data: ChangeItemRequestStatusModel,
  ): Promise<RentingItemRequestDTO> {
    const requestItem = await this.prismaService.rentingItemRequest.findUnique({
      where: { id: data.id },
    });
    const permissions = this.getPermissions(requestItem, data.updatedBy);

    if (permissions.includes(Permission.APPROVE)) {
      const result = await this.changeRentingItemRequestStatus({
        ...data,
        status: RentingItemRequestStatus.Approved,
      });

      await this.notificationService.approveRequestToUserNotification(
        result.ownerUserId,
        {
          id: result.id,
          itemName: result.rentingItem.name,
          itemId: result.itemId,
          fromDate: result.fromDate,
          toDate: result.toDate,
          ownerRequestId: result.ownerUserId,
          lenderRequestId: result.lenderUserId,
        },
      );

      return result;
    }

    throw new Error('Not Authorize');
  }

  public async declineRequest(
    data: ChangeItemRequestStatusModel,
  ): Promise<RentingItemRequestDTO> {
    const requestItem = await this.prismaService.rentingItemRequest.findUnique({
      where: { id: data.id },
    });
    const permissions = this.getPermissions(requestItem, data.updatedBy);

    if (permissions.includes(Permission.DECLINE)) {
      const result = await this.changeRentingItemRequestStatus({
        ...data,
        status: RentingItemRequestStatus.Declined,
      });

      await this.notificationService.declineRequestToUserNotification(
        result.ownerUserId,
        {
          id: result.id,
          itemName: result.rentingItem.name,
          itemId: result.itemId,
          fromDate: result.fromDate,
          toDate: result.toDate,
          ownerRequestId: result.ownerUserId,
          lenderRequestId: result.lenderUserId,
        },
      );

      return result;
    }

    throw new Error('Not Authorize');
  }

  public async startRequest(
    data: ChangeItemRequestStatusModel,
  ): Promise<RentingItemRequestDTO> {
    const requestItem = await this.prismaService.rentingItemRequest.findUnique({
      where: { id: data.id },
    });
    const permissions = this.getPermissions(requestItem, data.updatedBy);

    if (permissions.includes(Permission.START)) {
      const result = await this.changeRentingItemRequestStatus({
        ...data,
        status: RentingItemRequestStatus.InProgress,
      });

      await this.notificationService.startRequestToUserNotification(
        result.lenderUserId,
        {
          id: result.id,
          itemName: result.rentingItem.name,
          itemId: result.itemId,
          fromDate: result.fromDate,
          toDate: result.toDate,
          ownerRequestId: result.ownerUserId,
          lenderRequestId: result.lenderUserId,
        },
      );

      return result;
    }

    throw new Error('Not Authorize');
  }

  public async completeRequest(
    data: ChangeItemRequestStatusModel,
  ): Promise<RentingItemRequestDTO> {
    const requestItem = await this.prismaService.rentingItemRequest.findUnique({
      where: { id: data.id },
    });
    const permissions = this.getPermissions(requestItem, data.updatedBy);

    if (permissions.includes(Permission.COMPLETE)) {
      const result = await this.changeRentingItemRequestStatus({
        ...data,
        status: RentingItemRequestStatus.Completed,
      });

      await this.notificationService.completeRequestToUserNotification(
        result.ownerUserId,
        {
          id: result.id,
          itemName: result.rentingItem.name,
          itemId: result.itemId,
          fromDate: result.fromDate,
          toDate: result.toDate,
          ownerRequestId: result.ownerUserId,
          lenderRequestId: result.lenderUserId,
        },
      );

      return result;

      return result;
    }

    throw new Error('Not Authorize');
  }

  private async changeRentingItemRequestStatus({
    id,
    status,
    updatedBy,
    comment,
    files,
    actualTotalAmount,
  }: ChangeItemRequestStatusModel): Promise<RentingItemRequestDTO> {
    const updatingData: any = {
      status,
      updatedBy,
    };

    if (actualTotalAmount || actualTotalAmount === 0) {
      updatingData['actualTotalAmount'] = actualTotalAmount;
    }

    const rentingRequest = await this.prismaService.rentingItemRequest.update({
      where: {
        id,
      },
      data: updatingData,
      include: {
        rentingItem: true,
      },
    });
    await this.prismaService.rentingItemRequestActivity.create({
      data: {
        rentingItemRequest: {
          connect: {
            id,
          },
        },
        comment,
        files: files && files.length ? files : [],
        type: RequestActivityTypeMap[status],
        createdBy: updatedBy,
        updatedBy,
      },
    });

    const permissions = this.getPermissions(rentingRequest, updatedBy);
    return toRentingItemRequestDTO(rentingRequest, permissions);
  }

  public async comment({
    id,
    updatedBy,
    comment,
    files,
  }: ChangeItemRequestStatusModel): Promise<RentingItemRequestActivityDTO> {
    const newActivity = await this.prismaService.rentingItemRequestActivity.create(
      {
        data: {
          rentingItemRequest: {
            connect: {
              id,
            },
          },
          comment,
          files: files && files.length ? files : [],
          type: RentingItemRequestActivityType.Comment,
          createdBy: updatedBy,
          updatedBy,
        },
      },
    );

    const result = toRentingItemRequestActivityDTO(newActivity);
    result.createdBy = await this.userService.getUserDetailData(updatedBy);
    result.updatedBy = await this.userService.getUserDetailData(updatedBy);

    return result;
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
