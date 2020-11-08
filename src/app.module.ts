import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ConfigModule } from '@nestjs/config';

import {
  AuthModule,
  AreasModule,
  CategoriesModule,
  StoragesModule,
  PrismaModule
} from './modules'

import { rootContants } from './constants'
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
      context: ({ request }) => {
        return ({ req: request });
      },
      debug: !rootContants.isProduction,
      playground: !rootContants.isProduction
    }),
    AuthModule,
    AreasModule,
    CategoriesModule,
    StoragesModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ]
})
export class AppModule {}
