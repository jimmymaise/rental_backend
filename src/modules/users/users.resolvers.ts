import { UseGuards } from '@nestjs/common'
import { Args, Resolver, Mutation, Query, Context } from '@nestjs/graphql'

import {
  User,
  UserInfo
} from '@prisma/client';
import { UsersService } from './users.service'
import {
  GuardUserPayload
} from '../auth/auth.dto';
import { GqlAuthGuard } from '../auth/gpl-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'
import { UserInfoInputDTO } from './user-info.dto'

@Resolver('User')
export class UsersResolvers {
  constructor(private readonly userService: UsersService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async whoAmI(@CurrentUser() user: GuardUserPayload) {
    return this.userService.getUserDetailData(user.id)
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updateUserInfoData(
    @CurrentUser() user: GuardUserPayload,
    @Args('userInfoData') userInfoData: UserInfoInputDTO,
  ): Promise<UserInfo> {
    return this.userService.updateUserProfile(user.id, userInfoData)
  }
}

