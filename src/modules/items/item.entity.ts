import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

import { ImageItemModel } from '../images/image-item.model'

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column("varchar", { length: 200 })
  name: string

  @Column("varchar", { length: 200, unique: true })
  slug: string

  @Column("varchar", { length: 5000 })
  description: string

  @Column("varchar", { array: true })
  categoryIds: string[]

  @Column("varchar", { array: true })
  locationAreaIds: string[]

  @Column("simple-json", { array: true })
  images: ImageItemModel[];

  @Column("bigint", { array: true })
  unavailableForRentDays: bigint[]

  @Column("bigint", { array: true })
  bookedRentingDays: bigint[]

  @Column("bigint", { nullable: true })
  currentOriginalPrice: bigint

  @Column("bigint", { nullable: true })
  pricePerDay: bigint

  @Column("bigint", { nullable: true })
  pricePerWeek: bigint

  @Column("bigint", { nullable: true })
  pricePerMonth: bigint

  @Column("int", { default: 0 })
  reviewScore: number

  @Column("int", { default: 0 })
  reviewCount: number

  @Column({ default: false })
  isVerified: boolean

  @Column({ type: "uuid", nullable: false })
  ownerUserProfileId: string

  @Column({ default: false })
  isDisabled: boolean

  @Column({ default: false })
  isDeleted: boolean
}
