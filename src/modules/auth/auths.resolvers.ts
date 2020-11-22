import { UseGuards } from '@nestjs/common'
import { Args, Resolver, Mutation, Query, Context } from '@nestjs/graphql'

import { AuthService } from './auth.service'
import {
  AuthDTO,
  GuardUserPayload
} from './auth.dto';
import { GqlAuthGuard } from './gpl-auth.guard'
import { GqlRefreshGuard } from './gpl-request.guard'
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
    const { accessToken, refreshToken, ...restProps } = await this.authService.signUpByEmail(email, password)

    await this.usersService.setCurrentRefreshToken(refreshToken, restProps.user.id)

    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(accessToken)
    const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(refreshToken)

    context.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return {
      ...restProps,
      accessToken,
      refreshToken
    }
  }

  @Mutation()
  async loginByEmail(
    @Context() context: any, // GraphQLExecutionContext
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<AuthDTO> {
    const { accessToken, refreshToken, ...restProps } = await this.authService.loginByEmail(email, password)

    await this.usersService.setCurrentRefreshToken(refreshToken, restProps.user.id)

    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(accessToken)
    const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(refreshToken)
    context.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return {
      ...restProps,
      accessToken,
      refreshToken
    }
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  whoAmI(@CurrentUser() user: GuardUserPayload) {
    return this.usersService.getUserById(user.id);
  }

  @Mutation()
  @UseGuards(GqlRefreshGuard)
  async refreshUserAccessToken(
    @Context() context: any, // GraphQLExecutionContext
    @CurrentUser() currentUser: GuardUserPayload,
    @Args('refresh') refresh: string,
  ): Promise<AuthDTO> {
    const user = await this.usersService.getUserById(currentUser.id)

    const accessToken = this.authService.getAccessToken({
      userId: user.id,
      email: user.email
    })

    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(accessToken)
    context.res.setHeader('Set-Cookie', accessTokenCookie);

    return {
      accessToken,
      user
    }
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async logout(
    @Context() context: any,
    @CurrentUser() currentUser: GuardUserPayload,
  ) {
    await this.authService.removeRefreshToken(currentUser.id)

    const tokenHeaderCookie = this.authService.getCookieForLogout()
    context.res.setHeader('Set-Cookie', tokenHeaderCookie);

    return true
  }
}

