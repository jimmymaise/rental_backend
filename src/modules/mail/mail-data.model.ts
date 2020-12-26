export interface MailData {
  fromAddress: string;
  toAddress: string;
  senderName: string;
  replyToAddress?: string;
  bodyHtml: string;
  bodyText: string;
  subject: string;
}