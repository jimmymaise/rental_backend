import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'

import { MyUserContactsService } from './my-user-contacts.service'
import {
  MyUserContact,
} from '@prisma/client';
import {
  GuardUserPayload,
  CurrentUser,
  GqlAuthGuard
} from '../auth'
import { PaginationDTO } from '../../models'
import { MyUserContactDTO } from './my-user-contact.dto'
import { UsersService } from '../users/users.service'

@Resolver('MyUserContact')
export class WishingItemsResolvers {
  constructor(
    private readonly myUserContactService: MyUserContactsService,
    private userService: UsersService
  ) {}

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async addUserToMyContactList(
    @CurrentUser() user: GuardUserPayload,
    @Args('userId') userId: string,
  ): Promise<MyUserContact> {
    return this.myUserContactService.addUserToMyContactList(user.id, userId)
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async deleteUserFromMyContactList(
    @CurrentUser() user: GuardUserPayload,
    @Args('userId') userId: string,
  ): Promise<MyUserContact> {
    return this.myUserContactService.deleteUserFromMyContactList(user.id, userId)
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async feedMyContacts(
    @CurrentUser() user: GuardUserPayload,
    @Args('query') query: {
      offset: number,
      limit: number
    }
  ): Promise<PaginationDTO<MyUserContactDTO>> {
    const { offset, limit } = query || {}
    const actualLimit = limit && limit > 100 ? 100 : limit
    const result = await this.myUserContactService.findAllMyContactList({
      userId: user.id,
      offset,
      limit
    })

    const transformItems = []
    for (let i = 0; i < result.items.length; i++) {
      const item = result.items[i]
      transformItems.push({
        id: item.id,
        createdDate: item.createdDate.getTime(),
        userInfo: await this.userService.getUserDetailData(item.userId)
      })
    }

    return {
      items: transformItems,
      total: result.total,
      offset: offset || 0,
      limit: actualLimit
    }
  }
}

