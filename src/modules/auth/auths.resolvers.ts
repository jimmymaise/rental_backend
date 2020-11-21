import { UseGuards } from '@nestjs/common'
import { Args, Resolver, Mutation, Query, Context } from '@nestjs/graphql'

import { AuthService } from './auth.service'
import {
  AuthDTO,
  GuardUserPayload
} from './auth.dto';
import { GqlAuthGuard } from './gpl-auth.guard'
import { CurrentUser } from './current-user.decorator'
import { UsersService } from '../users/users.service'

@Resolver('Auth')
export class AuthsResolvers {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Mutation()
  async signUpByEmail(
    @Context() context: any, // GraphQLExecutionContext
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<AuthDTO> {
    const { accessToken, ...restProps } = await this.authService.signUpByEmail(email, password)

    const tokenHeaderCookie = this.authService.getAuthCookieHeader(accessToken)
    context.res.setHeader('Set-Cookie', tokenHeaderCookie);

    return {
      ...restProps,
      accessToken
    }
  }

  @Mutation()
  async loginByEmail(
    @Context() context: any, // GraphQLExecutionContext
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<AuthDTO> {
    const { accessToken, ...restProps } = await this.authService.loginByEmail(email, password)

    const tokenHeaderCookie = this.authService.getAuthCookieHeader(accessToken)
    context.res.setHeader('Set-Cookie', tokenHeaderCookie);

    return {
      ...restProps,
      accessToken
    }
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  whoAmI(@CurrentUser() user: GuardUserPayload) {
    return this.usersService.getUserById(user.userId);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  logout(@Context() context: any) {
    const tokenHeaderCookie = this.authService.getAuthCookieHeaderForLogout()
    context.res.setHeader('Set-Cookie', tokenHeaderCookie);

    return true
  }
}

