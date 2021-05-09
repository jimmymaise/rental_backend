import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

import { OrgCheckHandler } from '@helpers/handlers/org-check-handler';
import { PrismaService } from '../prisma/prisma.service';
import { OffsetPaginationDTO } from '@app/models';
import { CreateRoleDto, UpdateRoleDto } from './roles.dto';
import { OffsetPagingHandler } from '@helpers/handlers/offset-paging-handler';

@Injectable()
export class RolesService {
  constructor(private prismaService: PrismaService) {}

  async getRole(roleId: string, include: any): Promise<Role> {
    return this.prismaService.role.findUnique({
      where: { id: roleId },
      include: include,
    });
  }

  async createRole(
    createRoleData: CreateRoleDto,
    include?: any,
  ): Promise<Role> {
    const orgCheckHandler = new OrgCheckHandler(this.prismaService);
    const addedCommand = {};

    const usersAdded = (createRoleData['users'] || []).map((user) => {
      return {
        id: user,
      };
    });
    const permissionsAdded = (createRoleData['permissions'] || []).map(
      (permission) => {
        return { id: permission };
      },
    );

    if (usersAdded.length > 0) {
      if (
        !(await orgCheckHandler.isAllUsersInOrg(
          createRoleData.orgId,
          createRoleData['users'] || [],
        ))
      ) {
        throw Error(
          `Some users does not belong to this org ${createRoleData.orgId}`,
        );
      }

      addedCommand['users'] = {
        connect: usersAdded,
      };
    }

    if (permissionsAdded.length > 0) {
      addedCommand['permissions'] = {
        connect: permissionsAdded,
      };
    }

    return await this.prismaService.role.create({
      include: include,
      data: {
        name: createRoleData.name,
        description: createRoleData.description,
        org: {
          connect: {
            id: createRoleData.orgId,
          },
        },
        ...addedCommand,
      },
    });
  }

  async updateRole(
    updateRoleData: UpdateRoleDto,
    orgId,
    include?: any,
  ): Promise<Role> {
    const orgCheckHandler = new OrgCheckHandler(this.prismaService);
    const addedCommand = { users: {}, permissions: {} };

    const usersAdded = (updateRoleData['addUsersToRole'] || []).map((user) => {
      return {
        id: user,
      };
    });

    const usersRemoved = (updateRoleData['removeUsersFromRole'] || []).map(
      (user) => {
        return {
          id: user,
        };
      },
    );

    const permissionsAdded = (updateRoleData['addPermissionsToRole'] || []).map(
      (permission) => {
        return { id: permission };
      },
    );

    const permissionsRemoved = (
      updateRoleData['removePermissionsToRole'] || []
    ).map((permission) => {
      return { id: permission };
    });

    if (usersAdded.length > 0) {
      if (
        !(await orgCheckHandler.isAllUsersInOrg(
          orgId,
          updateRoleData['addUsersToRole'] || [],
        ))
      ) {
        throw Error(`Some users does not belong to this org ${orgId}`);
      }
      addedCommand['users']['connect'] = usersAdded;
    }

    if (usersRemoved.length > 0) {
      if (
        !(await orgCheckHandler.isAllUsersInOrg(
          orgId,
          updateRoleData['removeUsersFromRole'] || [],
        ))
      ) {
        throw Error(`Some users does not belong to this org ${orgId}`);
      }
      addedCommand['users']['disconnect'] = usersRemoved;
    }

    if (permissionsAdded.length > 0) {
      addedCommand['permissions']['connect'] = permissionsAdded;
    }

    if (permissionsRemoved.length > 0) {
      addedCommand['permissions']['disconnect'] = permissionsRemoved;
    }

    delete updateRoleData['addPermissionsToRole'];
    delete updateRoleData['addUsersToRole'];
    delete updateRoleData['removeUsersFromRole'];
    delete updateRoleData['removePermissionsToRole'];

    return await this.prismaService.role.update({
      include: include,
      where: {
        orgId_id: {
          id: updateRoleData.id,
          orgId,
        },
      },
      data: {
        ...updateRoleData,
        ...addedCommand,
      },
    });
  }

  async getRolesByOrgIdWithOffsetPaging(
    orgId,
    pageSize: number,
    offset?: any,
    orderBy?: any,
    include?: any,
  ): Promise<OffsetPaginationDTO<Role>> {
    const whereQuery = {
      orgId: orgId,
    };

    return this.getRolesWithOffsetPaging(
      whereQuery,
      pageSize,
      offset,
      orderBy,
      include,
    );
  }

  async getRolesWithOffsetPaging(
    whereQuery: any,
    pageSize: number,
    offset?: any,
    orderBy: any = { id: 'desc' },
    include?: any,
  ): Promise<OffsetPaginationDTO<Role>> {
    const pagingHandler = new OffsetPagingHandler(
      whereQuery,
      pageSize,
      orderBy,
      this.prismaService,
      'role',
      include,
    );
    return pagingHandler.getPage(offset);
  }
}
