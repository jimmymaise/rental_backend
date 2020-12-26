import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AWSEmailService } from './aws-email.service';
import { EmailService } from './mail.service';

@Module({
  imports: [
    ConfigModule
  ],
  providers: [AWSEmailService, EmailService],
  exports: [EmailService]
})
export class MailModule {}
