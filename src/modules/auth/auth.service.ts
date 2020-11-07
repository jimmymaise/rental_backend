import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'

import { UsersService } from '../users/users.service'
import { AuthDTO } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUpByEmail(email: string, password: string): Promise<AuthDTO> {
    const user = await this.usersService.createUserByEmailPassword(email, password)
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
  }

  async loginByEmail(email: string, password: string): Promise<AuthDTO> {
    const user = await this.usersService.getUserByEmailPassword(email, password)
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
  }
}
