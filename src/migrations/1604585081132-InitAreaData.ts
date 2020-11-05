import {MigrationInterface, QueryRunner} from "typeorm"

import { Area } from '../modules/areas/area.entity'
import * as areaData from './data/area-data.json'

export class InitAreaData1604585081132 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('************** INSERT DATA **************');
    console.log('Insert data to table [areas]');

    for (let i = 0; i < areaData.length; i++) {
      const areaItem = areaData[i]
      const newArea = new Area()

      console.log(`INSERT AREA: ${areaItem.name}`)
      newArea.id = areaItem.id
      newArea.region = areaItem.region
      newArea.name = areaItem.name
      newArea.slug = areaItem.slug
      newArea.parentAreaId = areaItem.parentAreaId
      newArea.latitude = Number(areaItem.latitude)
      newArea.longitude = Number(areaItem.longitude)
      newArea.order = areaItem.order
      newArea.isDeleted = false
      newArea.isDisabled = false

      await queryRunner.manager.save(newArea)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('************** REVERTING **************');
    console.log('Delete data at table [areas]');

    for (let i = 0; i < areaData.length; i++) {
      await queryRunner.query(`DELETE FROM areas WHERE id='${areaData[i].id}'`);
    }
  }
}
