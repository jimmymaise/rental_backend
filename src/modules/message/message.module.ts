import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [MessageGateway],
})
export class MessageModule {}
