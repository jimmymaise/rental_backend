import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';

import {
  AuthModule,
  AreasModule,
  CategoriesModule,
  StoragesModule,
  PrismaModule,
  ItemsModule,
  RentingItemRequestsModule,
  WishingItemsModule,
  UsersModule,
  MyUserContactsModule,
  SearchKeywordModule,
  MailModule,
  MessageModule,
  NotificationModule,
  CommonModule,
} from './modules';

import { rootContants } from './constants';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    PrismaModule, // Global Module
    GraphQLModule.forRoot({
      cors: {
        origin: [
          'http://localhost:3500',
          'https://*.thuedo.vn',
          'https://thuedo.vn',
        ],
        credentials: true,
      },
      typePaths: ['./**/*.graphql'],
      context: ({ request, res }) => {
        return { req: request, res };
      },
      debug: !rootContants.isProduction,
      playground: !rootContants.isProduction
        ? {
            settings: {
              'request.credentials': 'include',
            },
          }
        : undefined,
      formatError: (err: any) => {
        return err.statusCode
          ? {
              message: err.message,
              statusCode: err.statusCode,
            }
          : err; // Format return error here
      },
      // uploads: {
      //   maxFileSize: 5000000,
      //   maxFiles: 5
      // }
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        GOOGLE_CLOUD_PROJECT_ID: Joi.string().required(),
        GOOGLE_CLOUD_STORAGE_CREDENTIAL: Joi.string().required(),
        DEFAULT_BUCKET_NAME: Joi.string().required(),
        FACEBOOK_APP_ID: Joi.string().required(),
        FACEBOOK_APP_SECRET: Joi.string().required(),
        FACEBOOK_LOGIN_CALLBACK_URL: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_LOGIN_CALLBACK_URL: Joi.string().required(),
        WEB_UI_SIGN_IN_SUCCESSFULLY_REDIRECT_URL: Joi.string().required(),
        AWS_SES_REGION: Joi.string().required(),
        AWS_SES_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SES_SECRET_ACCESS_KEY: Joi.string().required(),
        WEB_UI_RECOVERY_PASSWORD_URL: Joi.string().required(),
        RESET_PASSWORD_TOKEN_SECRET: Joi.string().required(),
        RESET_PASSWORD_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        GOOGLE_RECAPTCHA_V3_SECRET_KEY: Joi.string().required(),
        SENTRY_DSN: Joi.string().required(),
        APP_ENV: Joi.string().required(),
      }),
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    AreasModule,
    CategoriesModule,
    StoragesModule,
    ItemsModule,
    RentingItemRequestsModule,
    WishingItemsModule,
    MyUserContactsModule,
    SearchKeywordModule,
    MailModule,
    MessageModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
