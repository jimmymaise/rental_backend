import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

export enum RentingItemRequestStatus {
  Declined = 'declined',
  Approved = 'approved',
  RentingInProgress = 'renting-in-progress',
  Completed = 'completed'
}

@Entity('renting_item_requests')
export class RentingItemRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column("varchar", { array: true })
  itemIds: string[]

  @Column({ type: "uuid", nullable: false })
  ownerUserProfileId: string

  @Column({ type: "uuid", nullable: false })
  lenderUserProfileId: string

  @Column("varchar", { nullable: true, length: 5000 })
  note: string

  @Column("bigint", { nullable: true })
  numberOfDay: bigint

  @Column("bigint", { nullable: true })
  numberOfWeek: bigint

  @Column("bigint", { nullable: true })
  numberOfMonth: bigint

  @Column({ type: "varchar", nullable: true })
  cachedItemData: string

  @Column("varchar")
  status: RentingItemRequestStatus

  @Column("bigint")
  estimateRentStartDate: bigint

  @Column("bigint")
  estimateRentEndDate: bigint

  @Column("bigint")
  actualRentStartDate: bigint

  @Column("bigint")
  actualRentEndDate: bigint

  @Column("decimal", { nullable: true })
  estimateAmount: number;

  @Column("decimal", { nullable: true })
  totalAmount: number;

  @Column({ default: false })
  isDisabled: boolean

  @Column({ default: false })
  isDeleted: boolean
}
