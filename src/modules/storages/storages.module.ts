import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { StoragesService } from './storages.service';
import { GoogleCloudStorageService } from './google-cloud-storage.service';
import { S3StorageService } from './aws-s3-storage.service';

import { StoragesResolvers } from './storages.resolvers';

@Module({
  providers: [
    GoogleCloudStorageService,
    S3StorageService,
    ConfigService,
    StoragesService,
    StoragesResolvers
  ],
  exports: [StoragesService],
})
export class StoragesModule {}
