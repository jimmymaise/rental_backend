import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import {
  Item,
  ItemStatus
} from '@prisma/client';
import { ItemUserInputDTO } from './item-user-input.dto'
import { stringToSlug } from '../../helpers'
import { PaginationDTO } from '../../models'

@Injectable()
export class ItemsService {
  constructor(
    private prismaService: PrismaService
  ) {}

  // findAllAvailable(isFeatured: boolean): Promise<Item[]> {
  //   if (isFeatured !== null) {
  //     return this.prismaService.category.findMany({ where: { isDeleted: false, isDisabled: false, isFeatured } })
  //   }

  //   return this.prismaService.category.findMany({ where: { isDeleted: false, isDisabled: false } })
  // }

  // findAllAvailableInCategory(parentCategoryId: string): Promise<Category[]> {
  //   return this.prismaService.category.findMany({ where: { isDeleted: false, isDisabled: false, parentCategoryId } })
  // }

  createItem(item: Item): Promise<Item> {
    return this.prismaService.item.create({ data: item })
  }

  createItemForUser(itemData: ItemUserInputDTO, userId: string): Promise<Item> {
    const {
      name, description, categoryIds, areaIds, images,
      checkBeforeRentDocuments, keepWhileRentingDocuments,
      unavailableForRentDays, currentOriginalPrice,
      sellPrice, rentPricePerDay, rentPricePerMonth, rentPricePerWeek,
      note
    } = itemData
    const nowToString = Date.now().toString()

    return this.prismaService.item.create({
      data: {
        name,
        slug: `${stringToSlug(name)}-${nowToString.substr(nowToString.length - 5)}`,
        description,
        categories: {
          connect: categoryIds.map(id => ({ id }))
        },
        areas: {
          connect: areaIds.map(id => ({ id }))
        },
        images: JSON.stringify(images),
        checkBeforeRentDocuments: JSON.stringify(checkBeforeRentDocuments),
        keepWhileRentingDocuments: JSON.stringify(keepWhileRentingDocuments),
        unavailableForRentDays: (unavailableForRentDays || []).map(data => (new Date(data))),
        currentOriginalPrice,
        sellPrice,
        rentPricePerDay,
        rentPricePerWeek,
        rentPricePerMonth,
        note,
        status: ItemStatus.Draft,
        ownerUserId: userId,
        updatedBy: userId
      }
    })
  }

  async findAllAvailablesItem(searchValue: string = '', offset = 0, limit = 10): Promise<PaginationDTO<Item>> {
    const mandatoryWhere = {
      isDeleted: false,
      isVerified: true,
      status: ItemStatus.Published
    }

    const where = searchValue
    ? {
      AND: [
        {
          ...mandatoryWhere
        },
        {
          OR: [
            { name: { contains: searchValue } },
            { description: { contains: searchValue } },
          ],
        }
      ]
    }
    : mandatoryWhere

    const items = await this.prismaService.item.findMany({
      where,
      skip: offset,
      take: limit
    })
    const count = await this.prismaService.item.count({ where })

    return {
      items,
      total: count
    }
  }
}
