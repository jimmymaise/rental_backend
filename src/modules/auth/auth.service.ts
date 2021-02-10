import { Injectable, HttpService } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

import { rootContants } from '../../constants';
import { UsersService } from '../users/users.service';
import { AuthDTO } from './auth.dto';
import { TokenPayload } from './token-payload';

interface SignInUserSSOInfo {
  email?: string;
  displayName?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private httpService: HttpService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public getAccessToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }

  public validateTokenFromHeaders(
    headers: any,
  ): { userId: string; email: string } {
    if (headers['authorization']) {
      const bearerToken = headers.authorization.split(' ')[1];

      if (bearerToken) {
        return this.jwtService.decode(bearerToken) as any;
      }
    }

    if (headers['cookie']) {
      const cookies: string[] = headers.cookie.split('; ');
      const authToken = cookies
        .find((cookie) => cookie.trim().startsWith('Authentication'))
        .split('=')[1];

      if (authToken) {
        return this.jwtService.decode(authToken) as any;
      }
    }

    return null;
  }

  private getRefreshToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }

  private async verifyResetPasswordToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get('RESET_PASSWORD_TOKEN_SECRET'),
    });
  }

  private getResetPasswordToken(userId: string, email: string): string {
    return this.jwtService.sign(
      { userId, email },
      {
        secret: this.configService.get('RESET_PASSWORD_TOKEN_SECRET'),
        expiresIn: `${this.configService.get(
          'RESET_PASSWORD_TOKEN_EXPIRATION_TIME',
        )}s`,
      },
    );
  }

  public async generateResetPasswordToken(
    email: string,
  ): Promise<{ email: string; displayName: string; token: string }> {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new Error('User not existing');
    }

    const refreshPasswordToken = this.getResetPasswordToken(user.id, email);

    await this.usersService.setResetPasswordToken(
      refreshPasswordToken,
      user.id,
    );
    const userInfo = await this.usersService.getUserDetailData(user.id);

    return {
      email,
      displayName: userInfo.displayName,
      token: refreshPasswordToken,
    };
  }

  public async updatePasswordByToken(
    token: string,
    newPassword: string,
  ): Promise<User> {
    const { userId } = await this.verifyResetPasswordToken(token);
    const userInfo = await this.usersService.verifyResetPasswordToken(
      token,
      userId,
    );

    if (userInfo) {
      return await this.usersService.setUserPassword(userId, newPassword, true);
    } else {
      throw new Error('Token not valid');
    }
  }

  async signInByFacebookId(
    facebookId: string,
    fbAccessToken: string,
    userInfo: SignInUserSSOInfo,
  ): Promise<AuthDTO> {
    let user = await this.usersService.getUserByFacebookId(facebookId);

    if (!user && userInfo.email) {
      user = await this.usersService.getUserByEmail(userInfo.email);
    }

    if (!user) {
      user = await this.usersService.createUserByFacebookAccount(
        facebookId,
        fbAccessToken,
        null,
      );
      await this.usersService.createTheProfileForUser(user.id, userInfo as any);
    } else if (!user.facebookId) {
      // await this.usersService.connectWithFacebookAccount(user.id, facebookId, fbAccessToken)
    }

    const tokenPayload = { userId: user.id, facebookId };
    const accessToken = this.getAccessToken(tokenPayload);
    const refreshToken = this.getRefreshToken(tokenPayload);
    await this.usersService.updateLastSignedIn(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async signInByGoogleId(
    googleId: string,
    googleAccessToken: string,
    userInfo: SignInUserSSOInfo,
  ): Promise<AuthDTO> {
    let user = await this.usersService.getUserByGoogleId(googleId);

    if (!user && userInfo.email) {
      user = await this.usersService.getUserByEmail(userInfo.email);
    }

    if (!user) {
      user = await this.usersService.createUserByGoogleAccount(
        googleId,
        googleAccessToken,
        null,
      );
      await this.usersService.createTheProfileForUser(user.id, userInfo as any);
    } else if (!user.googleId) {
      // await this.usersService.connectWithGoogleAccount(user.id, googleId, googleAccessToken)
    }

    const tokenPayload = { userId: user.id, googleId };
    const accessToken = this.getAccessToken(tokenPayload);
    const refreshToken = this.getRefreshToken(tokenPayload);
    await this.usersService.updateLastSignedIn(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async signUpByEmail(email: string, password: string): Promise<AuthDTO> {
    const isEmailExisted = await this.usersService.getUserByEmail(email);
    if (isEmailExisted) {
      throw new Error('This email is existed!');
    }

    const user = await this.usersService.createUserByEmailPassword(
      email,
      password,
    );
    await this.usersService.createTheProfileForUser(user.id, {
      displayName: email.substr(0, email.indexOf('@')),
    } as any);

    const tokenPayload = { userId: user.id, email };
    const accessToken = this.getAccessToken(tokenPayload);
    const refreshToken = this.getRefreshToken(tokenPayload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async loginByEmail(email: string, password: string): Promise<AuthDTO> {
    const user = await this.usersService.getUserByEmailPassword(
      email,
      password,
    );

    const tokenPayload = { userId: user.id, email };
    const accessToken = this.getAccessToken(tokenPayload);
    const refreshToken = this.getRefreshToken(tokenPayload);
    await this.usersService.updateLastSignedIn(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async changeUserPassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<AuthDTO> {
    const user = await this.usersService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );

    const tokenPayload = { userId: user.id, email: user.email };
    const accessToken = this.getAccessToken(tokenPayload);
    const refreshToken = this.getRefreshToken(tokenPayload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async removeRefreshToken(userId: string): Promise<void> {
    return this.usersService.removeCurrentRefreshToken(userId);
  }

  getCookieWithJwtAccessToken(accessToken: string): string {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
    // https://stackoverflow.com/questions/60131986/why-chrome-can-t-set-cookie

    // Check the Info in Cookies Tab
    // With Credential = True
    return rootContants.isProduction
      ? `Authentication=${accessToken}; HttpOnly; Secure; Path=/; Max-Age=${this.configService.get(
          'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
        )}; SameSite=None;`
      : `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${this.configService.get(
          'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
        )}; SameSite=Lax;`;
  }

  getCookieWithJwtRefreshToken(refreshToken: string) {
    return rootContants.isProduction
      ? `Refresh=${refreshToken}; HttpOnly; Secure; Path=/; Max-Age=${this.configService.get(
          'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
        )}; SameSite=None;`
      : `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${this.configService.get(
          'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
        )}; SameSite=Lax;`;
  }

  getCookieForLogout(): string[] {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  async verifyRecaptchaResponse(responseStr: string): Promise<boolean> {
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${this.configService.get(
      'GOOGLE_RECAPTCHA_V3_SECRET_KEY',
    )}&response=${responseStr}`;

    try {
      const response: any = await this.httpService
        .get(verificationUrl)
        .toPromise();

      if (!response?.data?.success) {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }
}
