import { UseGuards } from '@nestjs/common'
import { Args, Resolver, Mutation, Query, Context } from '@nestjs/graphql'

import { UsersService } from './users.service'
import {
  GuardUserPayload
} from '../auth/auth.dto';
import { GqlAuthGuard } from '../auth/gpl-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'

@Resolver('User')
export class UsersResolvers {
  constructor(private readonly userService: UsersService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  whoAmI(@CurrentUser() user: GuardUserPayload) {
    return this.userService.getUserById(user.id);
  }
}

