import * as googleStorage from '@google-cloud/storage';
  
const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || 'thuedo-stag';
const GOOGLE_CLOUD_CREDENTIAL = JSON.parse(process.env.GOOGLE_CLOUD_STORAGE_CREDENTIAL || '{"type":"service_account","project_id":"thuedo-stag","private_key_id":"183d4aaa21b9981bee5006d4e0adb03c65b3cedf","private_key":"-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD5NfLQp76Ul1+y\\nE3yzZeBg1E7uXswse24V8C/lb6eRt0+GrM1pHOn7Ad//1dUixtij9Nu2iqhsDeI/\\naL8MHcIL9uPHdTPJTASH8BG2F2FnLZ7ZhUqRyvjUANC8Us+UjznUhrvAS7QU7xlq\\nxVa2GrLKYz8Er1jMvH9kYk/JDRQFqm7vOvz1ugAOe4ikzBsy9FTZNxynzF2iXdOr\\nwwCetgKVhWlyBFmQgay9BJCWxf/DbOvkwFiShyU4OEIgSy8pXn8LOMcrxjkVebxD\\nkAALdDkUfnrOimMlMQy8dM4g2XPW2HA4FdoVxaEuJjqzqx/SBVPiQMH9UtxPOIdd\\nSUXJS227AgMBAAECggEAAbdNjR8Ld9sGUfIX2ckPMRYqgTJAPxyceJ1sgpA3++Up\\nompFbH57FjQARM9w21TWMg7T219RKlsXOsuMWh6eHZ2H4XGOxa0E8IYGgTI1dqkH\\n0LZopIrqwdRL1I16+3FmJbX+r8BZQSfexhoNqBRbikJzsSMRE4aAF59ddZ07YnOz\\nV9oThbD3M9uyqECbgcAbqlftbagiHmsYA+ISST8+gZ6ZNEs4sENwyj7WuWzNzQfn\\n4iHZC44sONIOPLyYUNnpn+XBOZaAfwuNAE8e+2hI6gqVIbsLf76UStmS6l3winQZ\\n9MpIr6ln2YTr8VGDygbKOQpiz7qb3CB/9Ce42F3ZFQKBgQD/UvS11sMSfOU8xRFo\\nF5cu4p251MVvAQWVIoNayzzHlznod6RGUlEArLHqGqJYr3Ts7Zszn32ovSbsDew2\\ns7nDZtE9lMN+jF9xy9Isik8haRe5q1E2hr32yCvG3Gehgk7UrWIFroEoMbXOScBU\\n5b6lG4ki1wBU/mg+Hfp7djRLZQKBgQD53tlujXbw4ho+KVNGxj0M33ooWM6FTs+p\\nm3Jq7p9o1MLbtYZQO+EYx/QO3z1FyfqxIdfs6CKatTa+aUJ7d+CoViAd9ZX771f4\\ny9GECbUf7j9bQnMQX+DlbdpqiwbhA5aUgyj8bWR0TSdkbiICfiXUB3OJp2xiRv9T\\nDiN01f2SnwKBgGrVLSuA5zKvK8QXuUbSyCGIFPMSwmHGDa3vOQMekxn4fvR0SzpZ\\naydbGz6XUmLFV6ljalNZYtzd+JFA6huhbBMEzHx16K7k0XLuE80rOh0CujioJF0q\\nWAYQj7CvvHTp704yFhfGgqhs1GOynFVppDG1qdX4HF1z7e4/4PUT6qG5AoGBALqO\\nsyKChpJ1DgjpS97ktcI9vHQRUihf3lYQ1I2YGfboG5B06JJREtAwwjy0WogXtI+5\\n6ABelS+TKwthhZyvtVGZ9CLKMLBIVBNTAdwmb1AmzrDxXP2VyFEkAtZXdMxdpHi/\\nsMM/XagjzsyCGexoiQ/UfGQDV73Mqmc1gC2Ec+2bAoGBAOJ8QfoeqlWzrwAZess4\\nYhmjUkQ32SE7g8mwfZAZq0MEY3Z5D0dXzr8MkESuqdhfvJRZVA4G/eTA4kx5iYgy\\nkGMBe//Vkmbm2mfnTeoXLUcCecWewFqulYfgHprsXlGI3kEODyoSiLJoG9evAxzv\\nin21d0kKtGhNUXMXlXidUZMl\\n-----END PRIVATE KEY-----\\n","client_email":"thuedo-stag-gcs@thuedo-stag.iam.gserviceaccount.com","client_id":"104496557097358225368","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/thuedo-stag-gcs%40thuedo-stag.iam.gserviceaccount.com"}');
const DEFAULT_BUCKET_NAME = process.env.DEFAULT_BUCKET_NAME as string || 'default-asia-bucket';

const storage = new googleStorage.Storage({
  projectId: GOOGLE_CLOUD_PROJECT_ID,
  credentials: GOOGLE_CLOUD_CREDENTIAL
});

export class GoogleCloudStorageService {
  public static getPublicUrl = (bucketName: string, fileName: string) => process.env.NODE_ENV === 'production' ? `https://${bucketName}/${fileName}` : `https://storage.googleapis.com/${bucketName}/${fileName}`;

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

  public static sendFileToGCSByStream = (stream: any, filename: string, mimetype: string, bucketName: string = DEFAULT_BUCKET_NAME): Promise<string> => {
    return new Promise((resolve, reject) => {
      const bucket = storage.bucket(bucketName);
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
              resolve(GoogleCloudStorageService.getPublicUrl(bucketName, gcsFileName));
            });
        });
    });
  }
}

export default GoogleCloudStorageService;

