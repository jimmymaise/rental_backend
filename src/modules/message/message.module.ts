import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [ConfigModule, AuthModule, UsersModule],
  controllers: [],
  providers: [MessageGateway],
})
export class MessageModule {}
