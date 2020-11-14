import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

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
      typePaths: ['./**/*.graphql'],
      context: ({ request }) => {
        return ({ req: request });
      },
      debug: !rootContants.isProduction,
      playground: !rootContants.isProduction,
      uploads: {
        maxFileSize: 5000000, // 5 MB
        maxFiles: 5
      }
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
