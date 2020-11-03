import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

import { City } from '../modules/cities/city.entity'
import * as cityData from './data/full-city.json'

export class CityTable1603889450379 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('************** CREATE TABLE **************');
    console.log('Create Table City');

    await queryRunner.createTable(
      new Table({
        name: 'cities',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'provinceId',
            type: 'uuid',
            isNullable: false,
            
          },
          {
            name: 'provinceSlug',
            type: 'varchar',
            isNullable: false,
            length: '200',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
            length: '200',
          },
          {
            name: 'slug',
            type: 'varchar',
            isNullable: false,
            length: '200',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
            length: '1000',
          },
          {
            name: 'latitude',
            type: 'decimal',
            isNullable: true
          },
          {
            name: 'longitude',
            type: 'decimal',
            isNullable: true
          },
          {
            name: 'isDisabled',
            type: 'boolean',
            default: false,
          },
          {
            name: 'isDeleted',
            type: 'boolean',
            default: false,
          },
        ]
      }),
      false
    );

     // clear sqls in memory to avoid removing tables when down queries executed.
     queryRunner.clearSqlMemory();

     const foreignKey = new TableForeignKey({
        referencedTableName: 'provinces',
        columnNames: ['provinceId'],
        referencedColumnNames: ['id'],
         onDelete: "CASCADE"
     });
     // TableName: cities
     await queryRunner.createForeignKey("cities", foreignKey);

    for (let i = 0; i < cityData.length; i++) {
      const city = cityData[i]
      const newCity = new City()

      console.log(`INSERT CITY ${city.Name}`)
      newCity.id = city.id
      newCity.provinceId = city.provinceId,
      newCity.provinceSlug = city.provinceSlug
      newCity.slug = city.slug
      newCity.latitude = null
      newCity.longitude = null
      newCity.description = ''
      newCity.slug = city.slug
      newCity.name = city.Name

      await queryRunner.manager.save(newCity)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('************** REVERTING **************');
    console.log('Remove Table [cities]');
    await queryRunner.query(`DROP TABLE cities`);
  }
}
