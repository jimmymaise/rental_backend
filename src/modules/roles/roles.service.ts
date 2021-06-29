import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { OffsetPaginationDTO } from '@app/models';
import { CreateRoleDto, UpdateRoleDto, RoleDTO } from './roles.dto';
import { OffsetPagingHandler } from '@helpers/handlers/offset-paging-handler';
import { OrgActivityLogService } from '@modules/org-activity-log/org-activity-log.service';

@Injectable()
export class RolesService {
  constructor(
    private prismaService: PrismaService,
    private orgActivityLogService: OrgActivityLogService,
  ) {}

  async getRole(roleId: string, include: any): Promise<Role> {
    return this.prismaService.role.findUnique({
      where: { id: roleId },
      include: include,
    });
  }

  async createRole({
    createRoleData,
    include,
    createdBy,
  }: {
    createRoleData: CreateRoleDto;
    include?: any;
    createdBy: string;
  }): Promise<Role> {
    const addedCommand = {};
    const permissionsAdded = (createRoleData['permissions'] || []).map(
      (permission) => {
        return { name: permission };
      },
    );
    if (permissionsAdded.length > 0) {
      addedCommand['permissions'] = {
        connect: permissionsAdded,
      };
    }

    const result = await this.prismaService.role.create({
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

    await this.orgActivityLogService.logCreateRole({
      createdBy,
      data: {
        roleId: result.id,
        roleName: result.name,
      },
      orgId: createRoleData.orgId,
    });

    return result;
  }

  async updateRole({
    orgId,
    updateRoleData,
    include,
    updatedBy,
  }: {
    updateRoleData: UpdateRoleDto;
    orgId;
    include?: any;
    updatedBy: string;
  }): Promise<Role> {
    const addedCommand = { users: {}, permissions: {} };

    const permissionsAdded = (updateRoleData['addPermissionsToRole'] || []).map(
      (permission) => {
        return { name: permission };
      },
    );

    const permissionsRemoved = (
      updateRoleData['removePermissionsFromRole'] || []
    ).map((permission) => {
      return { name: permission };
    });

    if (permissionsAdded.length > 0) {
      addedCommand['permissions']['connect'] = permissionsAdded;
    }

    if (permissionsRemoved.length > 0) {
      addedCommand['permissions']['disconnect'] = permissionsRemoved;
    }

    delete updateRoleData['addPermissionsToRole'];
    delete updateRoleData['removePermissionsFromRole'];

    const result = await this.prismaService.role.update({
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

    await this.orgActivityLogService.logUpdateRole({
      createdBy: updatedBy,
      data: {
        roleId: result.id,
        roleName: result.name,
        updateActions: [],
      },
      orgId,
    });

    return result;
  }

  async getRolesByOrgIdWithOffsetPaging(
    orgId,
    pageSize: number,
    offset?: any,
    orderBy?: any,
    include?: any,
  ): Promise<OffsetPaginationDTO<RoleDTO>> {
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
  ): Promise<OffsetPaginationDTO<RoleDTO>> {
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

  async getRoleDetail(id: string, include?: any): Promise<Role> {
    return this.prismaService.role.findUnique({
      where: {
        id,
      },
      include,
    });
  }

  async deleteRole(
    id: string,
    { orgId, updatedBy }: { orgId: string; updatedBy: string },
  ): Promise<Role> {
    const deletingRole = await this.getRoleDetail(id);

    if (deletingRole.isDefault) {
      throw new Error('Cannot delete default role');
    }

    const result = await this.prismaService.role.delete({
      where: {
        id,
      },
    });

    await this.orgActivityLogService.logDeleteRole({
      createdBy: updatedBy,
      data: {
        roleId: result.id,
        roleName: result.name,
      },
      orgId,
    });

    return result;
  }
}
