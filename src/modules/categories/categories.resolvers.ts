import { Args, Query, Resolver } from '@nestjs/graphql';

import { CategoriesService } from './categories.service';
import { Category } from '@prisma/client';
import { Permission } from '@modules/auth/permission/permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';

@Resolver('Category')
export class CategoriesResolvers {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query()
  @Permissions(Permission.NO_NEED_LOGIN)
  async getAllAvailableCategories(
    @Args('isFeatured') isFeatured?: boolean,
  ): Promise<Category[]> {
    return this.categoriesService.findAllAvailable(isFeatured);
  }

  @Query()
  @Permissions(Permission.NO_NEED_LOGIN)
  async getAllAvailableCategoriesInCategory(
    @Args('categoryId') categoryId?: string,
  ): Promise<Category[]> {
    return this.categoriesService.findAllAvailableInCategory(categoryId);
  }
}
