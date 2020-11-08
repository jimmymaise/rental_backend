import { Args, Query, Resolver } from '@nestjs/graphql'

import { CategoriesService } from './categories.service'
import {
  Category,
} from '@prisma/client';

@Resolver('Category')
export class CategoriesResolvers {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query()
  async getAllAvailableCategories(): Promise<Category[]> {
    return this.categoriesService.findAllAvailable()
  }

  @Query()
  async getAllAvailableCategoriesInCategory(@Args('categoryId') categoryId?: string): Promise<Category[]> {
    return this.categoriesService.findAllAvailableInCategory(categoryId)
  }
}
