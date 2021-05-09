import { Injectable } from '@nestjs/common';
import { PipeTransform } from '@nestjs/common';
import {} from '../';
import { StoragesService } from '@modules/storages/storages.service';

@Injectable()
export class UploadFilePipe implements PipeTransform {
  constructor(private readonly storagesService: StoragesService) {}

  transform(value: any): any {
    for (const [field, field_value] of Object.entries(value)) {
      if (field_value && field_value['isUploadField'] == true) {
        this.storagesService.handleUploadImageBySignedUrlComplete(
          field_value['id'],
          field_value['imageSizes'],
        );
      }
    }
    return value;
  }
}
