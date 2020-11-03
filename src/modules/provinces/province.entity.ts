import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { Country } from '../countries/country.entity';
import { City } from '../cities/city.entity';

@Entity('provinces')
export class Province {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "uuid" })
  countryId: string;

  @Column({ type: "varchar", length: 200 })
  countrySlug: string;

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

  @ManyToOne(type => Country, country => country.provinces)
  @JoinColumn({ name: "countryId" })
  country: Country;

  @OneToMany(() => City, (city: City) => city.province)
  cities: City[]
}
