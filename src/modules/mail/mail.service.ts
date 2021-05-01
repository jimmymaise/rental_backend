import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  GenerateHTMLResetPasswordEmail,
  GeneratePlainTextResetPasswordEmail,
} from './templates/reset-password';
import { AWSEmailService } from './aws-email.service';

import { MailData } from './mail-data.model';

const DEFAULT_FROM_EMAIL = 'nobody@thuedo.vn';
const DEFAULT_REPLY_TO_EMAIL = 'hotro@thuedo.vn';
const DEFAULT_SENDER_NAME = 'Thuê Đồ';

@Injectable()
export class EmailService {
  constructor(
    private configService: ConfigService,
    private awsEmailService: AWSEmailService,
  ) {}

  public async sendResetPasswordEmail(
    displayName: string,
    email: string,
    token: string,
  ): Promise<any> {
    const finalToken = Buffer.from(
      JSON.stringify({
        email,
        token,
      }),
    ).toString('base64');

    const url = `${this.configService.get(
      'WEB_UI_RECOVERY_PASSWORD_URL',
    )}?token=${finalToken}`;
    const htmlText = GenerateHTMLResetPasswordEmail({
      displayName,
      email,
      url,
    });
    const plainText = GeneratePlainTextResetPasswordEmail({
      displayName,
      email,
      url,
    });

    return this.awsEmailService.sendMail({
      fromAddress: DEFAULT_FROM_EMAIL,
      toAddress: email,
      replyToAddress: DEFAULT_REPLY_TO_EMAIL,
      bodyHtml: htmlText,
      senderName: DEFAULT_SENDER_NAME,
      bodyText: plainText,
      subject: `${
        displayName ? '[' + displayName + '] ' : ''
      }Khôi phục mật khẩu`,
    });
  }
}
