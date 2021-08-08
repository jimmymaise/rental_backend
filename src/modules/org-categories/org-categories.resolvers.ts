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
  async getAllPublicAvailableOrgCategories(
    @Args('orgId') orgId: string,
  ): Promise<OrgCategory[]> {
    return this.categoriesService.findAllAvailable(orgId);
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_ORG_CATEGORY)
  @UseGuards(GqlAuthGuard)
  async getAllAvailableOrgCategories(
    @CurrentUser() user: GuardUserPayload,
  ): Promise<OrgCategory[]> {
    return this.categoriesService.findAllAvailable(user.currentOrgId);
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_ORG_CATEGORY)
  @UseGuards(GqlAuthGuard)
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

  @Query()
  @Permissions(Permission.NO_NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async getOrgCategoryDetailBySlug(
    @Args('orgId') orgId: string,
    @Args('slug') slug: string,
  ): Promise<OrgCategory> {
    return this.categoriesService.getDetailBySlug(orgId, slug);
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.CREATE_ORG_CATEGORY)
  @UseGuards(GqlAuthGuard)
  async createOrgCategory(
    @CurrentUser() user: GuardUserPayload,
    @Args('data') data: OrgCategoryCreateModel,
  ): Promise<OrgCategory> {
    return this.categoriesService.create({
      orgId: user.currentOrgId,
      data: OrgCategoryCreateModel.toDatabase(data),
      createdBy: user.id,
    });
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.UPDATE_ORG_CATEGORY)
  @UseGuards(GqlAuthGuard)
  async updateOrgCategory(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
    @Args('data') data: OrgCategoryCreateModel,
  ): Promise<OrgCategory> {
    return this.categoriesService.update({
      id,
      orgId: user.currentOrgId,
      data: OrgCategoryCreateModel.toDatabase(data),
      updatedBy: user.id,
    });
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.DELETE_ORG_CATEGORY)
  @UseGuards(GqlAuthGuard)
  async deleteOrgCategory(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
  ): Promise<OrgCategory> {
    return this.categoriesService.delete({
      id,
      orgId: user.currentOrgId,
      updatedBy: user.id,
    });
  }
}
