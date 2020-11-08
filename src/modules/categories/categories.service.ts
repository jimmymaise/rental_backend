import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { PrismaService } from '../prisma/prisma.service'
import {
  Category
} from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(
    private prismaService: PrismaService
  ) {}

  findAllAvailable(): Promise<Category[]> {
    return this.prismaService.category.findMany({ where: { isDeleted: false, isDisabled: false } })
  }

  findAllAvailableInCategory(parentCategoryId: string): Promise<Category[]> {
    return this.prismaService.category.findMany({ where: { isDeleted: false, isDisabled: false, parentCategoryId } })
  }
}
