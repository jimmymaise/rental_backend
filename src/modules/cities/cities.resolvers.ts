import { Args, Query, Resolver } from '@nestjs/graphql';

import { CitiesService } from './cities.service';
import { City } from './city.entity';

@Resolver('City')
export class CitiesResolvers {
  constructor(private readonly citiesService: CitiesService) {}
}

