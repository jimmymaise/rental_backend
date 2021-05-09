import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';

import { GqlAuthGuard } from '@app/modules';
import { PermissionsService } from './permissions.service';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { Permission } from '@modules/auth/permission/permission.enum';
import { PermissionDTO } from './permissions.dto';

@Resolver('Permissions')
export class PermissionsResolvers {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Query()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async getOrgAvailablePermissions(): Promise<{
    items: PermissionDTO[];
  }> {
    const allPermissions = await this.permissionsService.getAvailablePermissionsForOrg();

    return {
      items: allPermissions.map(({ name, description, isInternal }) => ({
        name,
        description,
        isInternal,
      })),
    };
  }
}
