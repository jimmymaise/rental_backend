import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IStorageService } from '@modules/storages/storage.service.interface';

import * as googleStorage from '@google-cloud/storage';

@Injectable()
export class GoogleCloudStorageService implements IStorageService {
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
    folderPath: string,
    fileName: string,
  ) =>
    `${process.env.GOOGLE_CLOUD_STORAGE_HOST}${bucketName}/${folderPath}/${fileName}`;

  private maskSignedUrl = (orginalUrl: string, bucketName: string) =>
    orginalUrl.replace(
      `https://storage.googleapis.com/${bucketName}`,
      `${process.env.GOOGLE_CLOUD_STORAGE_HOST}${bucketName}`,
    );
  // public static copyFileToGCS = (localFilePath: string, bucketName: string, options: any) => {
  //   options = options || {};

  //   const bucket = storage.bucket(bucketName);
  //   const fileName = path.basename(localFilePath);
  //   const file = bucket.file(fileName);

  //   return bucket.upload(localFilePath, options)
  //     .then(() => file.makePublic())
  //     .then(() => exports.getPublicUrl(bucketName, gcsName));
  // };

  public async getPreSignedUrlForDownload(
    filePath: string,
    bucketName: string = this.configService.get('DEFAULT_BUCKET_NAME'),
  ): Promise<string> {
    return this.generateV4ReadSignedUrl(filePath, bucketName);
  }

  // https://www.codota.com/code/javascript/functions/%40google-cloud%2Fstorage/File/getSignedUrl
  public async getPreSignedUrlForUpload(
    filePath: string,
    contentType: string,
    size: number,
    bucketName: string = this.configService.get('DEFAULT_BUCKET_NAME'),
  ): Promise<string> {
    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(filePath);

    const response = await file.getSignedUrl({
      action: 'write',
      contentType,
      extensionHeaders: {
        'X-Upload-Content-Length': size,
      },
      expires: Date.now() + 60 * 1000, // 1 minute
      version: 'v4',
    });

    // const signedUrl = this.maskSignedUrl(response[0], bucketName);
    return response[0];
  }

  public async generateV4ReadSignedUrl(
    filePath: string,
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
      .file(filePath)
      .getSignedUrl(options);

    return url;
  }

  public async makePublic(
    folderPath: string,
    fileName: string,
    bucketName: string,
  ): Promise<void> {
    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(`${folderPath}/${fileName}`);

    await file.makePublic();
  }

  public async deleteFile(
    folderPath: string,
    fileName: string,
    bucketName: string,
  ): Promise<void> {
    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(`${folderPath}/${fileName}`);

    await file.delete();
  }

  public sendFileToGCS = (
    file: any,
    folderPath: string = 'custom-folder',
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
          resolve(this.getPublicUrl(bucketName, folderPath, gcsFileName));
        });
      });

      stream.end(file.buffer);
    });
  };

  public sendFileToCloudByStream = (
    stream: any,
    filePath: string,
    mimetype: string,
    bucketName: string = this.configService.get('DEFAULT_BUCKET_NAME'),
  ): Promise<string> => {
    return this.sendFileToGCSByStream(stream, filePath, mimetype, bucketName);
  };

  public sendFileToGCSByStream = (
    stream: any,
    filePath: string,
    mimetype: string,
    bucketName: string = this.configService.get('DEFAULT_BUCKET_NAME'),
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const bucket = this.storage.bucket(bucketName);
      const gcsFileName = filePath;
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
