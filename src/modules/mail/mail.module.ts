import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AWSEmailService } from './aws-email.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule]
    }),
  ],
  providers: [AWSEmailService],
  exports: [AWSEmailService]
})
export class MailModule {}
