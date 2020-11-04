import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from './area.entity';

// https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
// https://blog.codinghorror.com/a-visual-explanation-of-sql-joins/
@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area)
    private areasRepository: Repository<Area>,
  ) {}

  findAll(isDisabled: boolean = false): Promise<Area[]> {
    return this.areasRepository.find({ isDisabled });
  }
}
