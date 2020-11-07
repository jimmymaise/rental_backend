import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'

import { AreasModule, PrismaModule } from './modules'
import * as connectionOptions from './ormconfig'

import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    PrismaModule, // Global Module
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      debug: true,
      playground: true
    }),
    AreasModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ]
})
export class AppModule {}
