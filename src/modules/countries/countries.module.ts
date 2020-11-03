import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Country } from './country.entity';
import { CountriesService } from './countries.service';
import { CountriesResolvers } from './countries.resolvers';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  providers: [CountriesService, CountriesResolvers],
})
export class CountriesModule {}
