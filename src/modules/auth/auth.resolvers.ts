import { Args, Resolver, Mutation } from '@nestjs/graphql'

import { AuthService } from './auth.service'
import {
  AuthDTO
} from './auth.dto';

@Resolver('Auth')
export class AuthsResolvers {
  constructor(private readonly authService: AuthService) {}

  @Mutation()
  async signUpByEmail(
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<AuthDTO> {
    return this.authService.signUpByEmail(email, password)
  }

  @Mutation()
  async loginByEmail(
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<AuthDTO> {
    return this.authService.loginByEmail(email, password)
  }
}

