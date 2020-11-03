import { Args, Query, Resolver } from '@nestjs/graphql';

import { ProvincesService } from './provinces.service';
import { Province } from './province.entity';

@Resolver('Province')
export class ProvincesResolvers {
  constructor(private readonly provincesService: ProvincesService) {}

  @Query('getProvincesByCountryId')
  async findByCountryId(
    @Args('countryId')
    countryId: string,
  ): Promise<Province[]> {
    return this.provincesService.findByCountryId(countryId)
  }
}

