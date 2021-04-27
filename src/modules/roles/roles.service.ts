import { Injectable } from '@nestjs/common';
import { OrgCheckHandler } from '@helpers/handlers/org-check-handler';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { CreateRoleDto, UpdateRoleDto } from './roles.dto';

@Injectable()
export class RolesService {
  constructor(
    private prismaService: PrismaService,
  ) {
  }

  async getRole(roleId: string, include: object): Promise<Role> {
    return this.prismaService.role.findUnique({
      where: { id: roleId },
      include: include,
    });

  }

  async createRole(
    createRoleData: CreateRoleDto, include?: object,
  ): Promise<Role> {
    let orgCheckHandler = new OrgCheckHandler(this.prismaService);
    let addedCommand = {};


    const usersAdded = (createRoleData['users'] || []).map(user => {
      return {
        id: user,
      };
    });
    const permissionsAdded = (createRoleData['permissions'] || []).map(permission => {
      return { id: permission };
    });


    if (usersAdded.length > 0) {

      if (!await orgCheckHandler.isAllUsersInOrg(createRoleData.orgId, createRoleData['users'] || [])) {
        throw Error(`Some users does not belong to this org ${createRoleData.orgId}`);
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

    delete createRoleData['permissions'];
    delete createRoleData['users'];
    return await this.prismaService.role.create({
      include: include,
      data: {
        ...createRoleData,
        ...addedCommand,

      },
    });
  }

  async updateRole(
    updateRoleData: UpdateRoleDto, orgId, include?: object,
  ): Promise<Role> {
    let orgCheckHandler = new OrgCheckHandler(this.prismaService);
    let addedCommand = { 'users': {}, 'permissions': {} };


    const usersAdded = (updateRoleData['addUsersToRole'] || []).map(user => {
      return {
        id: user,
      };
    });

    const usersRemoved = (updateRoleData['removeUsersFromRole'] || []).map(user => {
      return {
        id: user,
      };
    });

    const permissionsAdded = (updateRoleData['addPermissionsToRole'] || []).map(permission => {
      return { id: permission };
    });

    const permissionsRemoved = (updateRoleData['removePermissionsToRole'] || []).map(permission => {
      return { id: permission };
    });


    if (usersAdded.length > 0) {

      if (!await orgCheckHandler.isAllUsersInOrg(orgId, updateRoleData['addUsersToRole'] || [])) {
        throw Error(`Some users does not belong to this org ${orgId}`);
      }
      addedCommand['users']['connect'] = usersAdded;
    }

    if (usersRemoved.length > 0) {

      if (!await orgCheckHandler.isAllUsersInOrg(orgId, updateRoleData['removeUsersFromRole'] || [])) {
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
      where: { orgId_id: { id: updateRoleData.id, orgId: orgId } },
      data: {
        ...updateRoleData,
        ...addedCommand,
      },
    });
  }

}
