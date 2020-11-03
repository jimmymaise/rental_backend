import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { City } from './city.entity';
import { CitiesService } from './cities.service';
import { CitiesResolvers } from './cities.resolvers';

@Module({
  imports: [TypeOrmModule.forFeature([City])],
  providers: [CitiesService, CitiesResolvers],
})
export class CitiesModule {}
