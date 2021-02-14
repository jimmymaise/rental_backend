import { Injectable, HttpService } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

import { rootContants } from '../../constants';
import { AuthDTO } from './auth.dto';
import { TokenPayload } from './token-payload';

@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
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

  public getRefreshToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }

  public async verifyResetPasswordToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get('RESET_PASSWORD_TOKEN_SECRET'),
    });
  }

  public getResetPasswordToken(userId: string, email: string): string {
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

  public decodeJwtToken(token: string): any {
    return this.jwtService.decode(token);
  }

  async loginByEmail(email: string, password: string): Promise<AuthDTO> {
    const user = await this.getUserByEmailPassword(email, password);

    const permissions = (user as any).permissions?.map(
      ({ permission }) => permission,
    );
    const tokenPayload = { userId: user.id, email, permissions };
    const accessToken = this.getAccessToken(tokenPayload);
    const refreshToken = this.getRefreshToken(tokenPayload);
    await this.updateLastSignedIn(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async getUserByEmailPassword(email: string, password: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: { permissions: true },
    });
    if (!user) {
      throw new Error('No such user found');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new Error('Invalid password');
    }

    return user;
  }

  async updateLastSignedIn(userId: string): Promise<User> {
    return await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        lastSignedIn: new Date(),
      },
    });
  }

  async getUserById(userId: string): Promise<User> {
    return this.prismaService.user.findUnique({ where: { id: userId } });
    // throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getUserById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }
}
