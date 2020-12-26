import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService  } from '@nestjs/config';

import { UsersModule } from '../users/users.module'
import { AuthService } from './auth.service'
import { AuthsResolvers } from './auths.resolvers'

import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy'
import { FacebookStrategy } from './facebook.strategy'
import { GoogleStrategy } from './google.strategy'
import { AnonymousStrategy } from './anoymous.strategy'
import { AuthController } from './auth.controller'
import { MailModule } from '../mail/mail.module'


@Module({
  imports: [
    ConfigModule,
    UsersModule,
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`,
        },
      }),
    })
  ],
  providers: [
    AuthService,
    AuthsResolvers,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    FacebookStrategy,
    GoogleStrategy,
    AnonymousStrategy
  ],
  controllers: [
    AuthController
  ]
})
export class AuthModule {}
