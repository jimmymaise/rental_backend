export interface IStorageService {
  getPreSignedUrlForUpload(filename: string,
                           contentType: string,
                           size: number,
                           bucketName: string,
                           otherOptions?: any): Promise<string>;

  getPreSignedUrlForDownload(filename: string,
                             bucketName: string,
                             otherOptions?: any,
  ): Promise<string>;

  makePublic(filename: string,
             bucketName: string,
             otherOptions?: any): Promise<void>

}
