import { Injectable } from '@nestjs/common'
import * as moment from 'moment'

import { PrismaService } from '../prisma/prisma.service'
import { Item, RentingItemRequest, RentingItemRequestStatus } from '@prisma/client'
import { RentingItemRequestInputDTO } from './renting-item-request-input.dto'
import { PaginationDTO } from '../../models'

const WEEK_DAY = 7
const MONTH_DAY = 30

export enum RentingItemRequestUserType {
  Owner = 'owner',
  Lender = 'lender'
}

@Injectable()
export class RentingItemRequetsService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  calcTotalAmount(item: Item, fromDate: number, toDate: number, quantity: number): number {
    
    const diffDay = Math.abs(moment(fromDate).diff(moment(toDate), 'day'))

    const numberOfWeek = parseInt((diffDay / WEEK_DAY).toString())
    if (numberOfWeek >= 1 && item.rentPricePerWeek > 0) {
      const days = diffDay % WEEK_DAY
      
      return quantity * ((numberOfWeek * item.rentPricePerWeek) + (days * item.rentPricePerDay))
    }

    const numberOfMonth = parseInt((diffDay / MONTH_DAY).toString())
    if (numberOfMonth >= 1 && item.rentPricePerMonth > 0) {
      const days = diffDay % MONTH_DAY
      
      return quantity * ((numberOfMonth * item.rentPricePerMonth) + (days * item.rentPricePerDay))
    }

    return quantity * (diffDay * item.rentPricePerDay)
  }

  async createNewRequestForUser(data: RentingItemRequestInputDTO, ownerUserId: string): Promise<RentingItemRequest> {
    const {
      itemId,
      fromDate,
      toDate
    } = data;
    const item = await this.prismaService.item.findOne({ where: { id: itemId } })
    const totalAmount = await this.calcTotalAmount(item, fromDate, toDate, 1)

    return this.prismaService.rentingItemRequest.create({
      data: {
        rentingItem: {
          connect: {
            id: itemId
          }
        },
        rentingItemCachedInfo: JSON.stringify({
          name: item.name,
          images: item.images,
          rentPricePerDay: item.rentPricePerDay,
          rentPricePerWeek: item.rentPricePerWeek,
          rentPricePerMonth: item.rentPricePerMonth,
          currencyCode: item.currencyCode
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
        updatedBy: item.ownerUserId
      },
    });
  }

  async findAllRequestFromUser({
    offset = 0,
    limit = 10,
    ownerUserId,
    includes,
    sortBy,
    userType = RentingItemRequestUserType.Owner
  }): Promise<PaginationDTO<RentingItemRequest>> {
    const mandatoryWhere: any = {
      isDeleted: false
    };

    if (userType === RentingItemRequestUserType.Owner) {
      mandatoryWhere.ownerUserId = ownerUserId
    } else {
      mandatoryWhere.lenderUserId = ownerUserId
    }

    const validIncludeMap = {
      rentingItem: true
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
      status: true
    };
    
    if (validSortBy[sortBy]) {
      findCondition.sortBy = sortBy
    }

    const items = await this.prismaService.rentingItemRequest.findMany(findCondition);
    const count = await this.prismaService.rentingItemRequest.count({
      where: findCondition.where
    });

    return {
      items,
      total: count,
      offset,
      limit
    };
  }
}
