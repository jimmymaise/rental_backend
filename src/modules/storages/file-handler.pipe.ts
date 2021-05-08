import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
  Param,
  SetMetadata,
} from '@nestjs/common';
import { StoragePublicDTO } from '../storages/storage-public.dto';
import { PipeTransform, ArgumentMetadata, Inject } from '@nestjs/common';
import {} from '../';
import { StoragesService } from '@modules/storages/storages.service';
import { hasPropertyKey } from '@nestjs/graphql/dist/plugin/utils/plugin-utils';

@Injectable()
export class UploadFilePipe implements PipeTransform {
  constructor(private readonly storagesService: StoragesService) {}

  transform(value: any, metadata: ArgumentMetadata): any {
    for (const [field, field_value] of Object.entries(value)) {
      if (field_value && field_value['isUploadField'] == true) {
        this.storagesService.handleUploadImageBySignedUrlComplete(
          field_value['id'],
          field_value['image_sizes'],
        );
      }
    }
    return value;
  }
}
