import { FileUsingLocate } from '@prisma/client';

export class FilePreSignedUploadRequestModel {
  name: string;
  contentType: string;
  size: number;
  usingLocate: FileUsingLocate;
}
