import { Injectable } from '@nestjs/common'

import { GoogleCloudStorageService } from './google-cloud-storage.service'

@Injectable()
export class StoragesService {
  public uploadItemImage(stream: any, fileName: any): Promise<any> {
    return GoogleCloudStorageService.sendFileToGCSByStream(stream, fileName)
  }
}
