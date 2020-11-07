import { UseGuards } from '@nestjs/common'
import { Args, Resolver, Mutation, Query } from '@nestjs/graphql'
import {
  User
} from '@prisma/client';

import { AuthService } from './auth.service'
import {
  AuthDTO
} from './auth.dto';
import { GqlAuthGuard, CurrentUser } from './gpl-auth.guard'
import { UsersService } from '../users/users.service'

@Resolver('Auth')
export class AuthsResolvers {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Mutation()
  async signUpByEmail(
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<AuthDTO> {
    return this.authService.signUpByEmail(email, password)
  }

  @Mutation()
  async loginByEmail(
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<AuthDTO> {
    return this.authService.loginByEmail(email, password)
  }
  
  @Query()
  @UseGuards(GqlAuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return this.usersService.getUserById(user.id);
  }
}

