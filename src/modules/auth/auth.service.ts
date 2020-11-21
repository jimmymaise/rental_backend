import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { rootContants } from '../../constants'
import { UsersService } from '../users/users.service'
import { AuthDTO } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async signUpByEmail(email: string, password: string): Promise<AuthDTO> {
    const user = await this.usersService.createUserByEmailPassword(email, password)
    const accessToken = this.jwtService.sign({ userId: user.id, email })

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
  }

  async loginByEmail(email: string, password: string): Promise<AuthDTO> {
    const user = await this.usersService.getUserByEmailPassword(email, password)
    const accessToken = this.jwtService.sign({ userId: user.id, email })

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
  }

  getAuthCookieHeader(accessToken: string): string {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
    // https://stackoverflow.com/questions/60131986/why-chrome-can-t-set-cookie

    // Check the Info in Cookies Tab
    // With Credential = True
    return rootContants.isProduction ? `Authentication=${accessToken}; HttpOnly; Secure; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}; SameSite=None;`
      : `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}; SameSite=Lax;`
  }

  getAuthCookieHeaderForLogout(): string {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`
  }
}
