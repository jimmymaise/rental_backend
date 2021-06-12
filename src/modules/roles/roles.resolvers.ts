import { UseGuards } from '@nestjs/common';
import { Info, Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { GraphQLFieldHandler } from '@helpers/handlers/graphql-field-handler';
import { RolesService } from './roles.service';
import { GuardUserPayload } from '@modules/auth/auth.dto';
import { GqlAuthGuard } from '@app/modules';
import { CurrentUser } from '@app/modules';
import { CreateRoleDto, UpdateRoleDto } from './roles.dto';
import { Permission } from '@modules/auth/permission/permission.enum';
import { QueryWithOffsetPagingDTO } from '@modules/users/user-info.dto';
import { Role } from '@prisma/client';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { OffsetPaginationDTO } from '@app/models';
import { RoleDTO } from './roles.dto';

@Resolver('Role')
export class RolesResolvers {
  constructor(private readonly rolesService: RolesService) {}

  @Mutation()
  @UseGuards(GqlAuthGuard)
  @Permissions(Permission.ORG_MASTER, Permission.CREATE_ROLE)
  async createRole(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('createRoleInput') createRoleData: CreateRoleDto,
  ): Promise<Role> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForRelationalFields([
      'employees',
      'permissions',
    ]);
    return this.rolesService.createRole(
      { orgId: user.currentOrgId, ...createRoleData },
      include,
    );
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  @Permissions(Permission.ORG_MASTER, Permission.UPDATE_ROLE)
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

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_ROLE)
  @UseGuards(GqlAuthGuard)
  async getMyOrgRolesWithPaging(
    @Info() info: GraphQLResolveInfo,
    @CurrentUser() user: GuardUserPayload,
    @Args('getMyOrgRolesWithOffsetPagingData')
    getMyOrgRolesWithOffsetPagingData: QueryWithOffsetPagingDTO,
  ): Promise<OffsetPaginationDTO<RoleDTO>> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForNestedRelationalFields([
      { fieldName: 'employees', fieldPath: 'items.RoleInfo' },
      { fieldName: 'org', fieldPath: 'items.RoleInfo' },
      { fieldName: 'permissions', fieldPath: 'items.RoleInfo' },
    ]);

    return this.rolesService.getRolesByOrgIdWithOffsetPaging(
      user.currentOrgId,
      getMyOrgRolesWithOffsetPagingData.pageSize,
      getMyOrgRolesWithOffsetPagingData.offset,
      getMyOrgRolesWithOffsetPagingData.orderBy,
      include,
    );
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_ROLE)
  @UseGuards(GqlAuthGuard)
  async getRoleDetail(
    @Info() info: GraphQLResolveInfo,
    @Args('id')
    id: string,
  ): Promise<Role> {
    const graphQLFieldHandler = new GraphQLFieldHandler(info);
    const include = graphQLFieldHandler.getIncludeForNestedRelationalFields([
      { fieldName: 'org' },
      { fieldName: 'permissions' },
    ]);

    return this.rolesService.getRoleDetail(id, include);
  }

  @Mutation()
  @Permissions(Permission.ORG_MASTER, Permission.DELETE_ROLE)
  @UseGuards(GqlAuthGuard)
  async deleteRole(
    @Args('id')
    id: string,
  ): Promise<Role> {
    return this.rolesService.deleteRole(id);
  }
}
