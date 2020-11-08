import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service'
import { AuthDTO } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
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
}
