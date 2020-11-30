import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as googleStorage from '@google-cloud/storage';
  
@Injectable()
export class GoogleCloudStorageService {
  private storage: googleStorage.Storage

  constructor(private configService: ConfigService) {
    this.storage = new googleStorage.Storage({
      projectId: configService.get('GOOGLE_CLOUD_PROJECT_ID'),
      credentials: JSON.parse(configService.get('GOOGLE_CLOUD_STORAGE_CREDENTIAL'))
    })
  }

  public getPublicUrl = (bucketName: string, fileName: string) => process.env.NODE_ENV === 'production' ? `https://${bucketName}/${fileName}` : `https://storage.googleapis.com/${bucketName}/${fileName}`;

  // public static copyFileToGCS = (localFilePath: string, bucketName: string, options: any) => {
  //   options = options || {};
  
  //   const bucket = storage.bucket(bucketName);
  //   const fileName = path.basename(localFilePath);
  //   const file = bucket.file(fileName);
  
  //   return bucket.upload(localFilePath, options)
  //     .then(() => file.makePublic())
  //     .then(() => exports.getPublicUrl(bucketName, gcsName));
  // };

  // https://www.codota.com/code/javascript/functions/%40google-cloud%2Fstorage/File/getSignedUrl
  public async getPreSignedUrlForUpload(bucketName: string = this.configService.get('DEFAULT_BUCKET_NAME')): Promise<string> {
    const bucket = this.storage.bucket(bucketName)
    const file = bucket.file(`abc.txt`);
    const response = await file.getSignedUrl({
      action: 'write',
      contentType: 'text/plain',
      expires: Date.now() + 60 * 1000 // 1 minutes
    })

    return response[0]
  }
  
  public sendFileToGCS = (file: any, bucketName: string = this.configService.get('DEFAULT_BUCKET_NAME')): Promise<any> => {
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
    
        return bucketFile.makePublic()
          .then(() => {
            resolve(this.getPublicUrl(bucketName, gcsFileName));
          });
      });
    
      stream.end(file.buffer);
    });
  }

  public sendFileToGCSByStream = (stream: any, filename: string, mimetype: string, bucketName: string = this.configService.get('DEFAULT_BUCKET_NAME')): Promise<string> => {
    return new Promise((resolve, reject) => {
      const bucket = this.storage.bucket(bucketName);
      const gcsFileName = filename;
      const bucketFile: any = bucket.file(gcsFileName);

      stream.pipe(bucketFile.createWriteStream({
        metadata: {
          contentType: mimetype,
        }
      }))
        .on('error', function(err) {
          bucketFile.cloudStorageError = err;
          reject(err);
        })
        .on('finish', function() {
          bucketFile.cloudStorageObject = gcsFileName;
    
          return bucketFile.makePublic()
            .then(() => {
              resolve(this.getPublicUrl(bucketName, gcsFileName));
            });
        });
    });
  }
}

export default GoogleCloudStorageService;

