import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { jwtConstants } from './constants';
import { UsersModule } from '../users/users.module'
import { AuthService } from './auth.service'
import { AuthsResolvers } from './auths.resolvers'

import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    })
  ],
  providers: [
    AuthService,
    AuthsResolvers,
    LocalStrategy,
    JwtStrategy
  ]
})
export class AuthModule {}
