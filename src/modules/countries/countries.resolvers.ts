import { Query, Resolver } from '@nestjs/graphql';

import { CountriesService } from './countries.service';

@Resolver('Country')
export class CountriesResolvers {
  constructor(private readonly countriesService: CountriesService) {}

  @Query()
  async getCountries() {
    return this.countriesService.findAll();
  }
}

