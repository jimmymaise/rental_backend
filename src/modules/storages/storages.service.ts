import { Injectable } from '@nestjs/common'

import { GoogleCloudStorageService } from './google-cloud-storage.service'

@Injectable()
export class StoragesService {
  public uploadItemImage(file: any): Promise<any> {
    return GoogleCloudStorageService.sendFileToGCS(file)
  }
}
