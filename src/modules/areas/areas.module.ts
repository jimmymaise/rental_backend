import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Area } from './area.entity';
import { AreasService } from './areas.service';
import { AreasResolvers } from './areas.resolvers';

@Module({
  imports: [TypeOrmModule.forFeature([Area])],
  providers: [AreasService, AreasResolvers],
})
export class AreasModule {}
