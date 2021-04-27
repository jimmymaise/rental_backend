import {
  UseGuards,
} from '@nestjs/common';
import { Info, Args, Resolver, Mutation, Query, Context } from '@nestjs/graphql';
import { parseResolveInfo, ResolveTree, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';
import { GraphQLResolveInfo } from 'graphql';
import { GraphQLFieldHandler } from '@helpers/graphql-field-handler';
import { OrganizationsService } from './organizations.service';
import { GuardUserPayload, AuthDTO } from '@modules/auth/auth.dto';
import { EveryoneGqlAuthGuard, GqlAuthGuard } from '@app/modules';
import { CurrentUser } from '@app/modules';
import {
  CreateOrganizationDto,
  UpdateMyOrganizationDto,
} from './organizations.dto';
import  {Permission} from '@modules/auth/permission/permission.enum'

import { Organization } from '@prisma/client';
import { UploadFilePipe } from '@modules/storages/file-handler.pipe';
import { PublicUserInfoDTO } from '@modules/users/user-info.dto';
import  {Permissions} from '@modules/auth/permission/permissions.decorator'

@Resolver('Organization')
export class OrganizationsResolvers {
  constructor(
    private readonly organizationsService: OrganizationsService,
  ) {
  }

  @Query()
  @UseGuards(EveryoneGqlAuthGuard)
  @Permissions(Permission.REMOVE_CONNECT)
  async getMyOrg(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
  ):  Promise<Organization> {

    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForRelationalFields(['users']);
    return this.organizationsService.getOrganization(user.currentOrgId, include);
  }

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async createOrg(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('createOrganizationInput', UploadFilePipe) createOrganizationData: CreateOrganizationDto,
  ): Promise<Organization> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForRelationalFields(['users']);
    return this.organizationsService.createOrganization(createOrganizationData, user?.id, include);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  @Permissions(Permission.UPDATE_OWN_ORG)
  async updateMyOrg(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('updateMyOrganizationInput', UploadFilePipe) updateMyOrganizationData: UpdateMyOrganizationDto,
  ): Promise<Organization> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForRelationalFields(['users']);
    return this.organizationsService.updateOrganization(updateMyOrganizationData,user.currentOrgId, include);
  }


}

