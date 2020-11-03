import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './city.entity';

// https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
// https://blog.codinghorror.com/a-visual-explanation-of-sql-joins/
@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
  ) {}
}
