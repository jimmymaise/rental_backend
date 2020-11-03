import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Province } from './province.entity';
import { ProvincesService } from './provinces.service';
import { ProvincesResolvers } from './provinces.resolvers';

@Module({
  imports: [TypeOrmModule.forFeature([Province])],
  providers: [ProvincesService, ProvincesResolvers],
})
export class ProvincesModule {}
