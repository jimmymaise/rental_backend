import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';

import { OrgCategoriesService } from './org-categories.service';
import { OrgCategory } from '@prisma/client';
import { GuardUserPayload, CurrentUser, GqlAuthGuard } from '../auth';
import { Permission } from '@modules/auth/permission/permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { OrgCategoryCreateModel } from './models/org-category-create.model';

@Resolver('OrgCategory')
export class OrgCategoriesResolvers {
  constructor(private readonly categoriesService: OrgCategoriesService) {}

  @Query()
  @Permissions(Permission.NO_NEED_LOGIN)
  async getAllAvailableOrgCategories(
    @Args('orgId') orgId: string,
  ): Promise<OrgCategory[]> {
    return this.categoriesService.findAllAvailable(orgId);
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_ORG_CATEGORY)
  async getAllOrgCategories(
    @CurrentUser() user: GuardUserPayload,
  ): Promise<OrgCategory[]> {
    return this.categoriesService.findAll(user.currentOrgId);
  }

  @Query()
  @Permissions(Permission.NO_NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async getOrgCategoryDetail(@Args('id') id: string): Promise<OrgCategory> {
    return this.categoriesService.getDetail(id);
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.CREATE_ORG_CATEGORY)
  @UseGuards(GqlAuthGuard)
  async createOrgCategory(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: OrgCategoryCreateModel,
  ): Promise<OrgCategory> {
    return this.categoriesService.create(
      user.currentOrgId,
      OrgCategoryCreateModel.toDatabase(data),
    );
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.UPDATE_ORG_CATEGORY)
  @UseGuards(GqlAuthGuard)
  async updateOrgCategory(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
    @Args('data') data: OrgCategoryCreateModel,
  ): Promise<OrgCategory> {
    return this.categoriesService.update(
      id,
      user.currentOrgId,
      OrgCategoryCreateModel.toDatabase(data),
    );
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.DELETE_ORG_CATEGORY)
  @UseGuards(GqlAuthGuard)
  async deleteOrgCategory(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
  ): Promise<OrgCategory> {
    return this.categoriesService.delete(id, user.currentOrgId);
  }
}
