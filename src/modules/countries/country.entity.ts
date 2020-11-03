import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Province } from '../provinces/province.entity'

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "varchar", length: 200 })
  name: string;

  @Column({ type: "varchar", length: 200, unique: true })
  slug: string;

  @Column({ default: false })
  isDisabled: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @OneToMany(() => Province, (province: Province) => province.country)
  provinces: Province[]
}