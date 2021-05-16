export interface StorageDTO {
  id: string;
  url: string;
  name: string;
  bucketName: string;
  folderName: string;
  contentType: string;
  createdBy: string;
}

export class ImagePreSignedUploadInput {
  name: string;
  cloudName?: 'aws' | 'gc';
  contentType: string;
  includes: string[]
  fileSizeMap?: FileSizeMap;
}

export class FileSizeMap {
  small?: number;
  medium?: number;
  original?: number;
}
