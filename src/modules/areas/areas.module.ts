import { Module } from '@nestjs/common';

import { AreasService } from './areas.service';
import { AreasResolvers } from './areas.resolvers';

@Module({
  providers: [AreasService, AreasResolvers],
})
export class AreasModule {}
