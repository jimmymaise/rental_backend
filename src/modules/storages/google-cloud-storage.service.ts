import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as googleStorage from '@google-cloud/storage';

@Injectable()
export class GoogleCloudStorageService {
  private storage: googleStorage.Storage;

  constructor(private configService: ConfigService) {
    this.storage = new googleStorage.Storage({
      projectId: configService.get('GOOGLE_CLOUD_PROJECT_ID'),
      credentials: JSON.parse(
        configService.get('GOOGLE_CLOUD_STORAGE_CREDENTIAL'),
      ),
    });
  }

  public getPublicUrl = (
    bucketName: string,
    folderName: string,
    fileName: string,
  ) =>
    process.env.NODE_ENV === 'production'
      ? `https://${bucketName}/${folderName}/${fileName}`
      : `https://storage.googleapis.com/${bucketName}/${folderName}/${fileName}`;

  private maskSignedUrl = (orginalUrl: string, bucketName: string) =>
    process.env.NODE_ENV === 'production'
      ? orginalUrl.replace(
          `https://storage.googleapis.com/${bucketName}`,
          `https://${bucketName}`,
        )
      : orginalUrl;
  // public static copyFileToGCS = (localFilePath: string, bucketName: string, options: any) => {
  //   options = options || {};

  //   const bucket = storage.bucket(bucketName);
  //   const fileName = path.basename(localFilePath);
  //   const file = bucket.file(fileName);

  //   return bucket.upload(localFilePath, options)
  //     .then(() => file.makePublic())
  //     .then(() => exports.getPublicUrl(bucketName, gcsName));
  // };

  public async generateV4ReadSignedUrl(
    fileName: string,
    bucketName: string = this.configService.get('DEFAULT_BUCKET_NAME'),
  ): Promise<string> {
    // These options will allow temporary read access to the file
    const options: any = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    // Get a v4 signed URL for reading the file
    const [url] = await this.storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);

    return url;
  }

  // https://www.codota.com/code/javascript/functions/%40google-cloud%2Fstorage/File/getSignedUrl
  public async getPreSignedUrlForUpload(
    fileName: string,
    contentType: string,
    size: number,
    bucketName: string = this.configService.get('DEFAULT_BUCKET_NAME'),
  ): Promise<string> {
    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(fileName);

    const response = await file.getSignedUrl({
      action: 'write',
      contentType,
      extensionHeaders: {
        'X-Upload-Content-Length': size,
      },
      expires: Date.now() + 60 * 1000, // 1 minute
      version: 'v4',
    });

    const signedUrl = this.maskSignedUrl(response[0], bucketName);
    return signedUrl;
  }

  public async makePublic(
    folderName: string,
    fileName: string,
    bucketName: string,
  ): Promise<void> {
    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(`${folderName}/${fileName}`);

    await file.makePublic();
  }

  public async deleteFile(
    folderName: string,
    fileName: string,
    bucketName: string,
  ): Promise<void> {
    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(`${folderName}/${fileName}`);

    await file.delete();
  }

  public sendFileToGCS = (
    file: any,
    folderName: string = 'custom-folder',
    bucketName: string = this.configService.get('DEFAULT_BUCKET_NAME'),
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const bucket = this.storage.bucket(bucketName);
      const gcsFileName = `${Date.now()}-${file.originalname}`;
      const bucketFile: any = bucket.file(gcsFileName);

      const stream = bucketFile.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      stream.on('error', (err: any) => {
        bucketFile.cloudStorageError = err;
        reject(err);
      });

      stream.on('finish', () => {
        bucketFile.cloudStorageObject = gcsFileName;

        return bucketFile.makePublic().then(() => {
          resolve(this.getPublicUrl(bucketName, folderName, gcsFileName));
        });
      });

      stream.end(file.buffer);
    });
  };

  public sendFileToGCSByStream = (
    stream: any,
    filename: string,
    mimetype: string,
    bucketName: string = this.configService.get('DEFAULT_BUCKET_NAME'),
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const bucket = this.storage.bucket(bucketName);
      const gcsFileName = filename;
      const bucketFile: any = bucket.file(gcsFileName);

      stream
        .pipe(
          bucketFile.createWriteStream({
            metadata: {
              contentType: mimetype,
            },
          }),
        )
        .on('error', function (err) {
          bucketFile.cloudStorageError = err;
          reject(err);
        })
        .on('finish', function () {
          bucketFile.cloudStorageObject = gcsFileName;

          return bucketFile.makePublic().then(() => {
            resolve(this.getPublicUrl(bucketName, gcsFileName));
          });
        });
    });
  };
}

export default GoogleCloudStorageService;
