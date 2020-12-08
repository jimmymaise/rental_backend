import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { rootContants } from '../../constants'
import { UsersService } from '../users/users.service'
import { AuthDTO } from './auth.dto'
import { TokenPayload } from './token-payload'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  public getAccessToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
    })
  }

  private getRefreshToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`
    })
  }

  async signUpByEmail(email: string, password: string): Promise<AuthDTO> {
    const user = await this.usersService.createUserByEmailPassword(email, password)

    const tokenPayload = { userId: user.id, email }
    const accessToken = this.getAccessToken(tokenPayload)
    const refreshToken = this.getRefreshToken(tokenPayload)

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email
      }
    }
  }

  async loginByEmail(email: string, password: string): Promise<AuthDTO> {
    const user = await this.usersService.getUserByEmailPassword(email, password)

    const tokenPayload = { userId: user.id, email }
    const accessToken = this.getAccessToken(tokenPayload)
    const refreshToken = this.getRefreshToken(tokenPayload)

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email
      }
    }
  }

  async removeRefreshToken(userId: string): Promise<void> {
    return this.usersService.removeCurrentRefreshToken(userId)
  }

  getCookieWithJwtAccessToken(accessToken: string): string {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
    // https://stackoverflow.com/questions/60131986/why-chrome-can-t-set-cookie

    // Check the Info in Cookies Tab
    // With Credential = True
    return rootContants.isProduction ? `Authentication=${accessToken}; HttpOnly; Secure; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}; SameSite=None;`
      : `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}; SameSite=Lax;`
  }

  getCookieWithJwtRefreshToken(refreshToken: string) {
    return rootContants.isProduction ? `Refresh=${refreshToken}; HttpOnly; Secure; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}; SameSite=None;`
      : `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}; SameSite=Lax;`
  }

  getCookieForLogout(): string[] {
    return ['Authentication=; HttpOnly; Path=/; Max-Age=0', 'Refresh=; HttpOnly; Path=/; Max-Age=0']
  }
}
