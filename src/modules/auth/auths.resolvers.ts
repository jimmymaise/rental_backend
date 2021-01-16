import { UseGuards } from '@nestjs/common';
import { Args, Resolver, Mutation, Query, Context } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { AuthDTO, GuardUserPayload } from './auth.dto';
import { GqlAuthGuard } from './gpl-auth.guard';
import { GqlRefreshGuard } from './gpl-request.guard';
import { CurrentUser } from './current-user.decorator';
import { UsersService } from '../users/users.service';
import { EmailService } from '../mail';

@Resolver('Auth')
export class AuthsResolvers {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private emailService: EmailService,
  ) {}

  @Mutation()
  async signUpByEmail(
    @Context() context: any, // GraphQLExecutionContext
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthDTO> {
    const {
      accessToken,
      refreshToken,
      ...restProps
    } = await this.authService.signUpByEmail(email, password);

    await this.usersService.setCurrentRefreshToken(
      refreshToken,
      restProps.user.id,
    );

    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      accessToken,
    );
    const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(
      refreshToken,
    );

    context.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return {
      ...restProps,
      accessToken,
      refreshToken,
    };
  }

  @Mutation()
  async loginByEmail(
    @Context() context: any, // GraphQLExecutionContext
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthDTO> {
    const {
      accessToken,
      refreshToken,
      ...restProps
    } = await this.authService.loginByEmail(email, password);

    await this.usersService.setCurrentRefreshToken(
      refreshToken,
      restProps.user.id,
    );

    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      accessToken,
    );
    const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(
      refreshToken,
    );
    context.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return {
      ...restProps,
      accessToken,
      refreshToken,
    };
  }

  @Mutation()
  @UseGuards(GqlRefreshGuard)
  async refreshUserAccessToken(
    @Context() context: any, // GraphQLExecutionContext
    @CurrentUser() currentUser: GuardUserPayload,
    @Args('refresh') refresh: string,
  ): Promise<AuthDTO> {
    const user = await this.usersService.getUserById(currentUser.id);

    const accessToken = this.authService.getAccessToken({
      userId: user.id,
      email: user.email,
    });

    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      accessToken,
    );
    context.res.setHeader('Set-Cookie', accessTokenCookie);

    return {
      accessToken,
      user,
    };
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async logout(
    @Context() context: any,
    @CurrentUser() currentUser: GuardUserPayload,
  ) {
    await this.authService.removeRefreshToken(currentUser.id);

    const tokenHeaderCookie = this.authService.getCookieForLogout();
    context.res.setHeader('Set-Cookie', tokenHeaderCookie);

    return true;
  }

  @Mutation()
  async requestResetPassword(
    @Args('email') email: string,
    @Args('recaptchaKey') recaptchaKey: string,
  ): Promise<string> {
    const isRecaptchaKeyVerified = await this.authService.verifyRecaptchaResponse(recaptchaKey);

    if (!recaptchaKey) {
      throw Error('Recaptcha Key not valid');
    }

    const {
      token,
      displayName,
    } = await this.authService.generateResetPasswordToken(email);
    await this.emailService.sendResetPasswordEmail(displayName, email, token);
    return email;
  }

  @Mutation()
  async setPasswordByToken(
    @Args('token') token: string,
    @Args('password') password: string,
  ): Promise<string> {
    const user = await this.authService.updatePasswordByToken(token, password);

    return user.email;
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async changePassword(
    @Context() context: any, // GraphQLExecutionContext
    @CurrentUser() currentUser: GuardUserPayload,
    @Args('currentPassword') currentPassword: string,
    @Args('newPassword') newPassword: string,
  ): Promise<AuthDTO> {
    const {
      accessToken,
      refreshToken,
      ...restProps
    } = await this.authService.changeUserPassword(
      currentUser.id,
      currentPassword,
      newPassword,
    );

    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      accessToken,
    );
    const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(
      refreshToken,
    );
    context.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return {
      ...restProps,
      accessToken,
      refreshToken,
    };
  }
}
