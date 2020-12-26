import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

export interface MailData {
  fromAddress: string;
  toAddress: string;
  replyToAddress?: string;
  bodyHtml: string;
  bodyText: string;
  subject: string;
}

@Injectable()
export class AWSEmailService {
  private SESConfig;

  constructor(private configService: ConfigService) {
    this.SESConfig = {
      apiVersion: '2010-12-01',
      accessKeyId: this.configService.get('AWS_SES_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SES_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_SES_REGION'),
    };
  }

  private async sendMail(data: MailData): Promise<any> {
    const params = {
      Destination: {
        ToAddresses: [data.toAddress],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: data.bodyHtml,
          },
          Text: {
            Charset: 'UTF-8',
            Data: data.bodyText,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: data.subject,
        },
      },
      Source: data.fromAddress,
      ReplyToAddresses: [],
    };

    if (data.replyToAddress) {
      params.ReplyToAddresses.push(data.replyToAddress);
    }

    return new AWS.SES(this.SESConfig).sendEmail(params).promise();
  }
}
