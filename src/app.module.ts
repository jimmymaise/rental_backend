import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';

import {
  AuthModule,
  AreasModule,
  CategoriesModule,
  StoragesModule,
  PrismaModule,
  ItemsModule
} from './modules'

import { rootContants } from './constants'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    PrismaModule, // Global Module
    GraphQLModule.forRoot({
      cors: {
        origin: ["http://localhost:3500", "https://*.thuedo.vn", "https://thuedo.vn"],
        credentials: true,
      },
      typePaths: ['./**/*.graphql'],
      context: ({ request, res }) => {
        return ({ req: request, res });
      },
      debug: !rootContants.isProduction,
      playground: !rootContants.isProduction ? {
        settings: {
          "request.credentials": "include"
        }
      } : undefined,
      uploads: {
        maxFileSize: 5000000, // 5 MB
        maxFiles: 5
      }
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required()
      })
    }),
    AuthModule,
    AreasModule,
    CategoriesModule,
    StoragesModule,
    ItemsModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ]
})
export class AppModule {}
