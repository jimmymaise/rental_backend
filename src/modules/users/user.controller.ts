import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { UsersService } from './users.service';
import { AuthService } from '@modules/auth/auth.service';
import { Permissions } from '@modules/auth/permission/permissions.decorator';
import { Permission } from '@modules/auth/permission/permission.enum';
import { GqlPermissionsGuard } from '@modules/auth/permission/gql-permissions.guard';

// https://dev.to/elishaking/how-to-implement-facebook-login-with-nestjs-90h
// http://www.passportjs.org/docs/google/

// To check the user access_token from the Mobile App
// https://www.npmjs.com/package/passport-facebook-token
// https://www.npmjs.com/package/passport-google-oauth20
@Controller('user')
export class UserController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(GqlPermissionsGuard)
  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @UseGuards(GqlPermissionsGuard)
  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: any, @Res() res: any): Promise<any> {
    const facebookData = req.user;
    const authDTO = await this.userService.signInByFacebookId(
      facebookData.user.facebookId,
      facebookData.accessToken,
      {
        displayName: facebookData.user.displayName,
        email: facebookData.user.email,
      },
    );

    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      authDTO.accessToken,
    );
    const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(
      authDTO.refreshToken,
    );

    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return res.redirect(
      this.configService.get('WEB_UI_SIGN_IN_SUCCESSFULLY_REDIRECT_URL'),
    );
  }

  @Permissions(Permission.NO_NEED_LOGIN)
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Permissions(Permission.NO_NEED_LOGIN)
  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(@Req() req: any, @Res() res: any): Promise<any> {
    const googleData = req.user;
    const authDTO = await this.userService.signInByGoogleId(
      googleData.user.googleId,
      googleData.accessToken,
      {
        displayName: googleData.user.displayName,
        email: googleData.user.email,
      },
    );

    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      authDTO.accessToken,
    );
    const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(
      authDTO.refreshToken,
    );

    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return res.redirect(
      this.configService.get('WEB_UI_SIGN_IN_SUCCESSFULLY_REDIRECT_URL'),
    );
  }
}
