import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from './province.entity';

// https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
// https://blog.codinghorror.com/a-visual-explanation-of-sql-joins/
@Injectable()
export class ProvincesService {
  constructor(
    @InjectRepository(Province)
    private provincesRepository: Repository<Province>,
  ) {}

  findByCountryId(countryId: string): Promise<Province[]> {
    return this.provincesRepository.find({
      where: {
        countryId
      },
      join: {
        alias: "province",
        leftJoinAndSelect: {
          country: "province.country"
        }
      }
    })
  }
}
