import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './country.entity';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private countriesRepository: Repository<Country>,
  ) {}

  findAll(): Promise<Country[]> {
    return this.countriesRepository.find();
  }

  findOne(id: string): Promise<Country> {
    return this.countriesRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.countriesRepository.delete(id);
  }
}
