import { Args, Query, Resolver } from '@nestjs/graphql'

import { AreasService } from './areas.service'
import { Area } from './area.entity'

@Resolver('Area')
export class AreasResolvers {
  constructor(private readonly areasService: AreasService) {}

  @Query()
  async getAllAreas(
    @Args('isDisabled')
    isDisabled: boolean
  ): Promise<Area[]> {
    return this.areasService.findAll(isDisabled || false)
  }
}

