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
import { UserInfoDTO, UserInfoInputDTO } from './user-info.dto'


function toUserInfoDTO(user: User, userInfo: UserInfo): UserInfoDTO {
  if (!userInfo) {
    return null
  }

  return {
    ...userInfo,
    createdDate: userInfo.createdDate.getTime(),
    avatarImage: userInfo.avatarImage && userInfo.avatarImage.length ? JSON.parse(userInfo.avatarImage) : [],
    coverImage: userInfo.coverImage && userInfo.coverImage.length ? JSON.parse(userInfo.coverImage) : [],
    email: user?.email
  }
}

@Resolver('User')
export class UsersResolvers {
  constructor(private readonly userService: UsersService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async whoAmI(@CurrentUser() user: GuardUserPayload) {
    const userData = await this.userService.getUserById(user.id);
    const userInfoData = await this.userService.getUserInfoById(user.id);

    return toUserInfoDTO(userData, userInfoData)
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updateMyItem(
    @CurrentUser() user: GuardUserPayload,
    @Args('id') id: string,
    @Args('userInfoData') userInfoData: UserInfoInputDTO,
  ): Promise<UserInfoDTO> {
    return new Promise((resolve, reject) => {
      this.userService.updateUserProfile(user.id, userInfoData)
        .then((item) => {
          resolve(toUserInfoDTO(null, item))
        })
        .catch(reject)
    })
  }
}

