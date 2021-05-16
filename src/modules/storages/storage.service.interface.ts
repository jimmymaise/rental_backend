export interface IStorageService {
  getPreSignedUrlForUpload(
    filePath: string,
    contentType: string,
    size: number,
    bucketName: string,
    otherOptions?: any,
  ): Promise<string>;

  getPreSignedUrlForDownload(
    filePath: string,
    bucketName: string,
    otherOptions?: any,
  ): Promise<string>;

  makePublic(
    filePath: string,
    bucketName: string,
    otherOptions?: any,
  ): Promise<void>;
}
