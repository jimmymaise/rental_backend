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
import { UserInfoInputDTO, UserInfoDTO, PublicUserInfoDTO } from './user-info.dto'
import { Permission } from './permission.enum'

@Resolver('User')
export class UsersResolvers {
  constructor(private readonly userService: UsersService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async whoAmI(@CurrentUser() user: GuardUserPayload): Promise<UserInfoDTO> {
    return this.userService.getUserDetailData(user.id)
  }

  @Query()
  async userPublicProfile(@CurrentUser() user: GuardUserPayload, @Args('userId') userId: string): Promise<PublicUserInfoDTO> {
    const allData = await this.userService.getUserDetailData(userId)
    const permissions: Permission[] = []

    if (user) {
      if (user.id !== allData.id) {
        permissions.push(Permission.CONNECT)
        permissions.push(Permission.SEND_MESSAGE)
      }

      if (user.id === allData.id) {
        permissions.push(Permission.EDIT_PROFILE)
      }
    }

    return {
      id: allData.id,
      displayName: allData.displayName,
      bio: allData.bio,
      avatarImage: allData.avatarImage,
      coverImage: allData.coverImage,
      createdDate: allData.createdDate,
      permissions
    }
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updateUserInfoData(
    @CurrentUser() user: GuardUserPayload,
    @Args('userInfoData') userInfoData: UserInfoInputDTO,
  ): Promise<UserInfoDTO> {
    return this.userService.updateUserProfile(user.id, userInfoData)
  }
}

