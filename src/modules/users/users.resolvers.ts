import { UseGuards } from '@nestjs/common';
import { Args, Resolver, Mutation, Query, Context } from '@nestjs/graphql';

import { MyUserContact } from '@prisma/client';
import { UsersService } from './users.service';
import { GuardUserPayload } from '../auth/auth.dto';
import { GqlAuthGuard } from '../auth/gpl-auth.guard';
import { EveryoneGqlAuthGuard } from '../auth/everyone-gpl-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import {
  UserInfoInputDTO,
  UserInfoDTO,
  PublicUserInfoDTO,
} from './user-info.dto';
import { Permission } from './permission.enum';

@Resolver('User')
export class UsersResolvers {
  constructor(private readonly userService: UsersService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async whoAmI(@CurrentUser() user: GuardUserPayload): Promise<UserInfoDTO> {
    return this.userService.getUserDetailData(user.id);
  }

  @Query()
  @UseGuards(EveryoneGqlAuthGuard)
  async userPublicProfile(
    @CurrentUser() user: GuardUserPayload,
    @Args('userId') userId: string,
  ): Promise<PublicUserInfoDTO> {
    const allData = await this.userService.getUserDetailData(userId);
    const permissions: Permission[] = [];

    if (user) {
      if (user.id !== allData.id) {
        permissions.push(Permission.SEND_MESSAGE);

        if (await this.userService.isUserInMyContactList(user.id, allData.id)) {
          permissions.push(Permission.REMOVE_CONNECT);
        } else {
          permissions.push(Permission.CONNECT);
        }
      }

      if (user.id === allData.id) {
        permissions.push(Permission.EDIT_PROFILE);
      }
    }

    return {
      id: allData.id,
      displayName: allData.displayName,
      bio: allData.bio,
      avatarImage: allData.avatarImage,
      coverImage: allData.coverImage,
      createdDate: allData.createdDate,
      permissions,
    };
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updateUserInfoData(
    @CurrentUser() user: GuardUserPayload,
    @Args('userInfoData') userInfoData: UserInfoInputDTO,
  ): Promise<UserInfoDTO> {
    return this.userService.updateUserProfile(user.id, userInfoData);
  }
}
