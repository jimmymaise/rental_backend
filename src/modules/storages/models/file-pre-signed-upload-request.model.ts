import { FileUsingLocate } from '@app/models';

export class FilePreSignedUploadRequestModel {
  name: string;
  contentType: string;
  size: number;
  usingLocate: FileUsingLocate;
}
