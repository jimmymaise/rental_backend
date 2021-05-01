import { UseGuards } from '@nestjs/common';
import {
  Info,
  Args,
  Resolver,
  Mutation,
  Query,
  Context,
} from '@nestjs/graphql';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { GraphQLResolveInfo } from 'graphql';
import { GraphQLFieldHandler } from '@helpers/graphql-field-handler';
import { RolesService } from './roles.service';
import { GuardUserPayload, AuthDTO } from '@modules/auth/auth.dto';
import { EveryoneGqlAuthGuard, GqlAuthGuard } from '@app/modules';
import { CurrentUser } from '@app/modules';
import { CreateRoleDto, UpdateRoleDto } from './roles.dto';
import { Permission } from '@modules/auth/permission/permission.enum';

import { Role } from '@prisma/client';
import { UploadFilePipe } from '@modules/storages/file-handler.pipe';
import { PublicUserInfoDTO } from '@modules/users/user-info.dto';
import { Permissions } from '@modules/auth/permission/permissions.decorator';

@Resolver('Role')
export class RolesResolvers {
  constructor(private readonly rolesService: RolesService) {}

  @Mutation()
  @UseGuards(GqlAuthGuard)
  @Permissions(Permission.CREATE_ROLE)
  async createRole(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('createRoleInput') createRoleData: CreateRoleDto,
  ): Promise<Role> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForRelationalFields([
      'users',
      'permissions',
    ]);
    return this.rolesService.createRole(
      { orgId: user.currentOrgId, ...createRoleData },
      include,
    );
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  @Permissions(Permission.UPDATE_ROLE)
  async updateRole(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('updateRoleInput') updateRoleData: UpdateRoleDto,
  ): Promise<Role> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForRelationalFields([
      'users',
      'permissions',
    ]);
    return this.rolesService.updateRole(
      { ...updateRoleData },
      user.currentOrgId,
      include,
    );
  }
}
