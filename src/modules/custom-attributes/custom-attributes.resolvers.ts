import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';

import { Permission } from '@modules/auth/permission/permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { GuardUserPayload, CurrentUser, GqlAuthGuard } from '../auth';
import { CustomAttributesService } from './custom-attributes.service';
import { SellingOrderStatusModel } from './models';

@Resolver('CustomAttributes')
export class CustomAttributesResolvers {
  constructor(private customAttributeService: CustomAttributesService) {}

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async feedAllSellingStatusCustomAttributes(
    @CurrentUser() user: GuardUserPayload,
  ): Promise<SellingOrderStatusModel[]> {
    return this.customAttributeService.getAllSellingOrderStatusCustomAttributes(
      user.currentOrgId,
    );
  }

  @Query()
  @Permissions(Permission.ORG_MASTER, Permission.GET_CUSTOM_ATTRIBUTES)
  @UseGuards(GqlAuthGuard)
  async feedAllSystemSellingStatusCustomAttributes(): Promise<
    SellingOrderStatusModel[]
  > {
    return this.customAttributeService.getAllSystemSellingOrderStatus();
  }
}
