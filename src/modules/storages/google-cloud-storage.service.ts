import * as googleStorage from '@google-cloud/storage';
  
const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const GOOGLE_CLOUD_CREDENTIAL = JSON.parse(process.env.GOOGLE_CLOUD_STORAGE_CREDENTIAL || '{}');
const DEFAULT_BUCKET_NAME = process.env.DEFAULT_BUCKET_NAME as string;

const storage = new googleStorage.Storage({
  projectId: GOOGLE_CLOUD_PROJECT_ID,
  credentials: GOOGLE_CLOUD_CREDENTIAL
});

export class GoogleCloudStorageService {
  public static getPublicUrl = (bucketName: string, fileName: string) => `https://storage.googleapis.com/${bucketName}/${fileName}`;

  // public static copyFileToGCS = (localFilePath: string, bucketName: string, options: any) => {
  //   options = options || {};
  
  //   const bucket = storage.bucket(bucketName);
  //   const fileName = path.basename(localFilePath);
  //   const file = bucket.file(fileName);
  
  //   return bucket.upload(localFilePath, options)
  //     .then(() => file.makePublic())
  //     .then(() => exports.getPublicUrl(bucketName, gcsName));
  // };
  
  public static sendFileToGCS = (file: any, bucketName: string = DEFAULT_BUCKET_NAME): Promise<any> => {
    return new Promise((resolve, reject) => {
      const bucket = storage.bucket(bucketName);
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
            resolve(GoogleCloudStorageService.getPublicUrl(bucketName, gcsFileName));
          });
      });
    
      stream.end(file.buffer);
    });
  }

  public static sendFileToGCSByStream = (stream: any, fileName: string, bucketName: string = DEFAULT_BUCKET_NAME): Promise<any> => {
    const bucket = storage.bucket(bucketName);
    const gcsFileName = `${Date.now()}-${fileName}`;
    const bucketFile: any = bucket.file(gcsFileName);

    return new Promise((resolve, reject) => {
      stream.on('error', (err: any) => {
        bucketFile.cloudStorageError = err;
        reject(err);
      });
    
      stream.on('finish', () => {
        bucketFile.cloudStorageObject = gcsFileName;
    
        return bucketFile.makePublic()
          .then(() => {
            resolve(GoogleCloudStorageService.getPublicUrl(bucketName, gcsFileName));
          });
      });
    });
  }
}

export default GoogleCloudStorageService;

