import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ConfigModule } from '@nestjs/config';

import {
  AuthModule,
  AreasModule,
  PrismaModule
} from './modules'

import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule, // Global Module
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      debug: true,
      playground: true
    }),
    AuthModule,
    AreasModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ]
})
export class AppModule {}
