import { Args, Query, Resolver } from '@nestjs/graphql';

import { AreasService } from './areas.service';
import { Area } from '@prisma/client';
import { Permission } from '@modules/auth/permission/permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';

@Resolver('Area')
export class AreasResolvers {
  constructor(private readonly areasService: AreasService) {}

  @Query()
  @Permissions(Permission.NO_NEED_LOGIN)
  async getAllAvailableAreas(
    @Args('isDisabled')
    isDisabled: boolean,
  ): Promise<Area[]> {
    return this.areasService.findAll(isDisabled || false);
  }
}
