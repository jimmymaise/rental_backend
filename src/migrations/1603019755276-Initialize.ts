import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { Country } from '../modules/countries/country.entity';
import { COUNTRY_VIETNAM_UUID, COUNTRY_VIETNAM_SLUG } from './constant'

export class Initialize1603019755276 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {

    console.log('************** CREATE TABLE **************')
    console.log('Create Table countries')

    await queryRunner.createTable(
      new Table({
        name: 'countries',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
            length: '200'
          },
          {
            name: 'slug',
            type: 'varchar',
            isNullable: false,
            length: '200',
            isUnique: true
          },
          {
            name: 'isDisabled',
            type: 'boolean',
            default: false
          },
          {
            name: 'isDeleted',
            type: 'boolean',
            default: false
          }
        ],
      }),
      false,
    );

    console.log('************** INSERT DEFAULT DATA **************')
    // await queryRunner.query(`INSERT INTO countries (
    //   "id", "name", "slug") VALUES ($1, $2, $3)`, ['2613b724-0648-4bad-8a6f-f1f028ed3f11', 'Việt Nam', 'viet-nam']);
    const newCountry = new Country()
    newCountry.id = COUNTRY_VIETNAM_UUID
    newCountry.name = 'Việt Nam'
    newCountry.slug = COUNTRY_VIETNAM_SLUG
    await queryRunner.manager.save(newCountry)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('************** REVERTING **************')
    console.log('Remove Table [countries]')
    await queryRunner.query(`DROP TABLE countries`);
  }
}
