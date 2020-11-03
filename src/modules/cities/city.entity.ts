import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Province } from '../provinces/province.entity';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "uuid" })
  provinceId: string;

  @Column({ type: "varchar", length: 200 })
  provinceSlug: string;

  @Column({ type: "varchar", length: 200 })
  name: string;

  @Column({ type: "varchar", length: 200, unique: true })
  slug: string;

  @Column({ type: "varchar", length: 1000, nullable: true })
  description: string;

  @Column({ type: "decimal" })
  latitude: number;

  @Column({ type: "decimal" })
  longitude: number;

  @Column({ default: false })
  isDisabled: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(type => Province, province => province.cities)
  @JoinColumn({ name: "provinceId" })
  province: Province;
}
