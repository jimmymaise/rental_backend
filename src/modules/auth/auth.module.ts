import { Module, HttpModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCacheService } from '@modules/redis-cache/redis-cache.service';
import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from '@modules/users/users.service';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';

import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { FacebookStrategy } from './facebook.strategy';
import { GoogleStrategy } from './google.strategy';
import { AnonymousStrategy } from './anoymous.strategy';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    RedisCacheModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: `${configService.get(
            'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
          )}s`,
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    FacebookStrategy,
    GoogleStrategy,
    AnonymousStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {
}
