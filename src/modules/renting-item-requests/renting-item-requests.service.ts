import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Item, ItemStatus } from '@prisma/client';
import { RentingItemRequestInputDTO } from './renting-item-request-input.dto';
import { stringToSlug } from '../../helpers';

@Injectable()
export class ItemsService {
  constructor(private prismaService: PrismaService) {}

  // createNewRequestForUser(data: RentingItemRequestInputDTO, ownerUserId: string, lenderUserId: string): Promise<Item> {
  //   const {
  //     name,
  //     description,
  //     categoryIds,
  //     areaIds,
  //     images,
  //     checkBeforeRentDocuments,
  //     keepWhileRentingDocuments,
  //     unavailableForRentDays,
  //     currentOriginalPrice,
  //     sellPrice,
  //     rentPricePerDay,
  //     rentPricePerMonth,
  //     rentPricePerWeek,
  //     note,
  //   } = itemData;
  //   const nowToString = Date.now().toString();

  //   return this.prismaService.item.create({
  //     data: {
  //       name,
  //       slug: `${stringToSlug(name)}-${nowToString.substr(
  //         nowToString.length - 5,
  //       )}`,
  //       description,
  //       categories: {
  //         connect: categoryIds.map((id) => ({ id })),
  //       },
  //       areas: {
  //         connect: areaIds.map((id) => ({ id })),
  //       },
  //       images: JSON.stringify(images),
  //       checkBeforeRentDocuments: JSON.stringify(checkBeforeRentDocuments),
  //       keepWhileRentingDocuments: JSON.stringify(keepWhileRentingDocuments),
  //       unavailableForRentDays: (unavailableForRentDays || []).map(
  //         (data) => new Date(data),
  //       ),
  //       currentOriginalPrice,
  //       sellPrice,
  //       rentPricePerDay,
  //       rentPricePerWeek,
  //       rentPricePerMonth,
  //       note,
  //       status: ItemStatus.Draft,
  //       ownerUserId: userId,
  //       updatedBy: userId,
  //     },
  //   });
  // }
}
