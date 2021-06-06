import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { GqlPermissionsGuard } from './modules/auth/permission/gql-permissions.guard';
import { APP_GUARD } from '@nestjs/core';
import {
  AuthModule,
  EmployeesModule,
  OrganizationsModule,
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
  LoggingModule,
  RedisCacheModule,
  RolesModule,
  PermissionsModule,
  CustomAttributesModule,
  DataInitilizeModule,
  SellingOrderModule,
  CustomersModule,
  OrgCategoriesModule,
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
          'http://localhost:3700',
          'http://localhost:3600',
          'http://localhost:3500',
          'https://stag.thuedo.vn',
          'https://portal.thuedo.vn',
          'https://stag-portal.thuedo.vn',
          'https://thuedo.vn',
          'https://stag-host.thuedo.vn',
          'https://host.thuedo.vn',
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
        ENV_NAME: Joi.string().required(),
        ENCRYPT_PHONE_NUMBER_PASSWORD: Joi.string().required(),
        GOOGLE_CLOUD_STORAGE_HOST: Joi.string().required(),
        AWS_S3_HOST: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
      }),
    }),
    LoggingModule,
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
    RedisCacheModule,
    OrganizationsModule,
    RolesModule,
    PermissionsModule,
    EmployeesModule,
    CustomAttributesModule,
    DataInitilizeModule,
    SellingOrderModule,
    CustomersModule,
    OrgCategoriesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GqlPermissionsGuard,
    },
  ],
})
export class AppModule {}
