import { Strategy } from 'passport-anonymous'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

import { TokenPayload } from './token-payload'

@Injectable()
export class AnonymousStrategy extends PassportStrategy(Strategy, 'anonymous') {
  constructor() {
    super()
  }

  async validate(payload: TokenPayload) {
    return null
  }
}
