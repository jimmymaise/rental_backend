import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import {
  Item,
  ItemStatus
} from '@prisma/client';
import { ItemUserInputDTO } from './item-user-input.dto'
import { stringToSlug } from '../../helpers'

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

    // console.log('aaaa', images[0])

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
}
