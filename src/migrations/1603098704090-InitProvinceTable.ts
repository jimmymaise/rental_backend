import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

import { Province } from '../modules/provinces/province.entity'
import { COUNTRY_VIETNAM_UUID, COUNTRY_VIETNAM_SLUG } from './constant'
import * as provinceData from './data/province.json'

export class InitProvinceTable1603098704090 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('************** CREATE TABLE **************');
    console.log('Create Table Province');

    await queryRunner.createTable(
      new Table({
        name: 'provinces',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'countryId',
            type: 'uuid',
            isNullable: false,
            
          },
          {
            name: 'countrySlug',
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
          },
          {
            name: 'longitude',
            type: 'decimal',
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
        referencedTableName: 'countries',
        columnNames: ['countryId'],
        referencedColumnNames: ['id'],
         onDelete: "CASCADE"
     });
     // TableName: provinces
     await queryRunner.createForeignKey("provinces", foreignKey);

    for (let i = 0; i < provinceData.length; i++) {
      const province = provinceData[i]
      const newProvince = new Province()

      console.log(`INSERT PROVINCE ${province.name}`)
      newProvince.id = province.id
      newProvince.countryId = COUNTRY_VIETNAM_UUID
      newProvince.countrySlug = COUNTRY_VIETNAM_SLUG
      newProvince.slug = province.slug
      newProvince.latitude = Number(province.lat)
      newProvince.longitude = Number(province.lng)
      newProvince.description = ''
      newProvince.slug = province.slug
      newProvince.name = province.name

      await queryRunner.manager.save(newProvince)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('************** REVERTING **************');
    console.log('Remove Table [provinces]');
    await queryRunner.query(`DROP TABLE provinces`);
  }
}
