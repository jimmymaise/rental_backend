import { UseGuards } from '@nestjs/common';

import {
  Info,
  Args,
  Resolver,
  Mutation,
  Query,
  Context,
} from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { GraphQLFieldHandler } from '@helpers/handlers/graphql-field-handler';
import { OrganizationsService } from './organizations.service';
import { GuardUserPayload, AuthDTO } from '@modules/auth/auth.dto';
import { EveryoneGqlAuthGuard, GqlAuthGuard } from '@app/modules';
import { CurrentUser } from '@app/modules';
import {
  CreateOrganizationDto,
  UpdateMyOrganizationDto,
} from './organizations.dto';
import { Permission } from '@modules/auth/permission/permission.enum';

import { Organization } from '@prisma/client';
import { UploadFilePipe } from '@modules/storages/file-handler.pipe';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { OrganizationPublicInfoModel } from './models';

@Resolver('Organization')
export class OrganizationsResolvers {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  @Permissions(Permission.ORG_MASTER, Permission.GET_MY_ORG_DETAIL)
  async getMyOrg(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
  ): Promise<Organization> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForRelationalFields([
      'employees',
      'areas',
    ]);
    return this.organizationsService.getOrganization(
      user.currentOrgId,
      include,
    );
  }

  @Query()
  @UseGuards(EveryoneGqlAuthGuard)
  @Permissions(Permission.NO_NEED_LOGIN)
  async getPublicOrgDetail(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('orgId')
    orgId: string,
  ): Promise<OrganizationPublicInfoModel> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include: any = graphQLFieldHandler.getIncludeForRelationalFields([
      'areas',
      'isOrgInMyContactBook',
    ]);

    const dbOrg = await this.organizationsService.getOrganization(orgId, {
      areas: include.areas,
    });

    if (!dbOrg) {
      throw new Error('this org is not existed');
    }

    const result = OrganizationPublicInfoModel.fromDbOrganization(dbOrg);

    if (include.isOrgInMyContactBook) {
      const isOrgInMyContactBook =
        await this.organizationsService.isOrgInMyContactBook(user.id, dbOrg.id);

      result.isOrgInMyContactBook = isOrgInMyContactBook;
    }

    return result;
  }

  @Query()
  @UseGuards(EveryoneGqlAuthGuard)
  @Permissions(Permission.NO_NEED_LOGIN)
  async getPublicOrgDetailBySlug(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('slug')
    slug: string,
  ): Promise<OrganizationPublicInfoModel> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include: any = graphQLFieldHandler.getIncludeForRelationalFields([
      'areas',
      'isOrgInMyContactBook',
    ]);
    const dbOrg = await this.organizationsService.getOrganizationBySlug(slug, {
      areas: include.areas,
    });

    if (!dbOrg) {
      throw new Error('this org is not existed');
    }

    const result = OrganizationPublicInfoModel.fromDbOrganization(dbOrg);

    if (include.isOrgInMyContactBook) {
      const isOrgInMyContactBook =
        await this.organizationsService.isOrgInMyContactBook(user.id, dbOrg.id);

      result.isOrgInMyContactBook = isOrgInMyContactBook;
    }

    return result;
  }

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async switchMyOrg(
    @Info() info: GraphQLResolveInfo,
    @Context() context: any, // GraphQLExecutionContext
    @CurrentUser() user: GuardUserPayload,
    @Args('newOrgId')
    newOrgId: string,
  ): Promise<AuthDTO> {
    return this.organizationsService.authService.updateUserCurrentOrg(
      user.id,
      newOrgId,
      context,
    );
  }

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async createOrg(
    @Info() info: GraphQLResolveInfo,
    @Context() context: any, // GraphQLExecutionContext
    @CurrentUser() user: GuardUserPayload,
    @Args('createOrganizationInput', UploadFilePipe)
    createOrganizationData: CreateOrganizationDto,
  ): Promise<Organization> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForRelationalFields([
      'employees',
    ]);
    const createOrgResult = await this.organizationsService.createOrganization(
      createOrganizationData,
      user?.id,
      include,
    );
    await this.organizationsService.authService.updateUserCurrentOrg(
      user.id,
      createOrgResult.id,
      context,
    );
    return createOrgResult;
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  @Permissions(Permission.ORG_MASTER, Permission.UPDATE_OWN_ORG)
  async updateMyOrg(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('updateMyOrganizationInput', UploadFilePipe)
    updateMyOrganizationData: UpdateMyOrganizationDto,
  ): Promise<Organization> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForRelationalFields([
      'employees',
    ]);
    return this.organizationsService.updateOrganization({
      updateMyOrganizationData,
      orgId: user.currentOrgId,
      include,
      updatedBy: user.id,
    });
  }
}
