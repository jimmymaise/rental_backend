import { Controller, Get, UseGuards, HttpStatus, Req, Res } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service'

// https://dev.to/elishaking/how-to-implement-facebook-login-with-nestjs-90h
// http://www.passportjs.org/docs/google/

// To check the user access_token from the Mobile App
// https://www.npmjs.com/package/passport-facebook-token
// https://www.npmjs.com/package/passport-google-oauth20
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {}

  @Get("/facebook")
  @UseGuards(AuthGuard("facebook"))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get("/facebook/redirect")
  @UseGuards(AuthGuard("facebook"))
  async facebookLoginRedirect(@Req() req: any, @Res() res: any): Promise<any> {
    const facebookData = req.user
    const authDTO = await this.authService.signInByFacebookId(facebookData.user.facebookId, facebookData.accessToken, {
      displayName: facebookData.user.displayName
    })
    // const code = Buffer.from(JSON.stringify(authDTO)).toString('base64')

    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(authDTO.accessToken)
    const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(authDTO.refreshToken)

    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return res.redirect(this.configService.get('WEB_UI_SIGN_IN_SUCCESSFULLY_REDIRECT_URL'));
  }

  @Get("/google")
  @UseGuards(AuthGuard("google"))
  async googleLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get("/google/redirect")
  @UseGuards(AuthGuard("google"))
  async googleLoginRedirect(@Req() req: any, @Res() res: any): Promise<any> {
    const googleDate = req.user
    const authDTO = await this.authService.signInByGoogleId(googleDate.user.googleId, googleDate.accessToken, {
      displayName: googleDate.user.displayName
    })
    // const code = Buffer.from(JSON.stringify(authDTO)).toString('base64')
    
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(authDTO.accessToken)
    const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(authDTO.refreshToken)

    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return res.redirect(this.configService.get('WEB_UI_SIGN_IN_SUCCESSFULLY_REDIRECT_URL'));
  }
}