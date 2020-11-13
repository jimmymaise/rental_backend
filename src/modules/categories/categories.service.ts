import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import {
  Category
} from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(
    private prismaService: PrismaService
  ) {}

  findAllAvailable(isFeatured: boolean): Promise<Category[]> {
    if (isFeatured !== null) {
      return this.prismaService.category.findMany({ where: { isDeleted: false, isDisabled: false, isFeatured } })
    }

    return this.prismaService.category.findMany({ where: { isDeleted: false, isDisabled: false } })
  }

  findAllAvailableInCategory(parentCategoryId: string): Promise<Category[]> {
    return this.prismaService.category.findMany({ where: { isDeleted: false, isDisabled: false, parentCategoryId } })
  }
}
