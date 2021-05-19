import { Module } from '@nestjs/common';

import { DataInitilizeService } from './data-initialize.service';

@Module({
  providers: [DataInitilizeService],
  exports: [DataInitilizeService],
})
export class DataInitilizeModule {}
