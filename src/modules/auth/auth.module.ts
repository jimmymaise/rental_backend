import { Module } from '@nestjs/common'

import { UsersModule } from '../users/users.module'
import { AuthService } from './auth.service'
import { AuthsResolvers } from './auth.resolvers'

@Module({
  imports: [UsersModule],
  providers: [AuthService, AuthsResolvers]
})
export class AuthModule {}
