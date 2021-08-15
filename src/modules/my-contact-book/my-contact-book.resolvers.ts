import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';

import { MyContactBooksService } from './my-contact-book.service';
import { MyContactBook } from '@prisma/client';
import { GuardUserPayload, CurrentUser, GqlAuthGuard } from '../auth';
import { OffsetPaginationDTO } from '../../models';
import { MyContactBookDTO } from './my-contact-book.dto';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { Permission } from '@modules/auth/permission/permission.enum';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { MyContactBookType } from './constants';

@Resolver('MyContactBook')
export class WishingItemsResolvers {
  constructor(
    private readonly myContactBookService: MyContactBooksService,
    private userService: UsersService,
    private organizationService: OrganizationsService,
  ) {}

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async addUserToMyContactBook(
    @CurrentUser() user: GuardUserPayload,
    @Args('userId') userId: string,
  ): Promise<MyContactBook> {
    return this.myContactBookService.addUserToMyContactBook(user.id, userId);
  }

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async deleteUserFromMyContactBook(
    @CurrentUser() user: GuardUserPayload,
    @Args('userId') userId: string,
  ): Promise<MyContactBook> {
    return this.myContactBookService.deleteUserFromMyContactBook(
      user.id,
      userId,
    );
  }

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async addOrgToMyContactBook(
    @CurrentUser() user: GuardUserPayload,
    @Args('orgId') orgId: string,
  ): Promise<MyContactBook> {
    return this.myContactBookService.addOrgToMyContactBook(user.id, orgId);
  }

  @Mutation()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async deleteOrgFromMyContactBook(
    @CurrentUser() user: GuardUserPayload,
    @Args('orgId') orgId: string,
  ): Promise<MyContactBook> {
    return this.myContactBookService.deleteOrgFromMyContactBook(user.id, orgId);
  }

  @Query()
  @Permissions(Permission.NEED_LOGIN)
  @UseGuards(GqlAuthGuard)
  async feedMyContacts(
    @CurrentUser() user: GuardUserPayload,
    @Args('query')
    query: {
      offset: number;
      limit: number;
    },
  ): Promise<OffsetPaginationDTO<MyContactBookDTO>> {
    const { offset, limit } = query || {};
    const actualLimit = limit && limit > 100 ? 100 : limit;
    const result = await this.myContactBookService.findAllMyContactBook({
      userId: user.id,
      offset,
      limit,
    });

    const transformItems = [];
    for (let i = 0; i < result.items.length; i++) {
      const item = result.items[i];
      if (item.type === MyContactBookType.User) {
        transformItems.push({
          userId: user.id,
          createdDate: item.createdDate.getTime(),
          userInfo: await this.userService.getUserDetailData(item.contactId),
        });
      } else if (item.type === MyContactBookType.Organization) {
        transformItems.push({
          userId: user.id,
          createdDate: item.createdDate.getTime(),
          organizationInfo: await this.organizationService.getOrgSummaryCache(
            item.contactId,
          ),
        });
      }
    }

    return {
      items: transformItems,
      total: result.total,
      offset: offset || 0,
      limit: actualLimit,
    };
  }
}
