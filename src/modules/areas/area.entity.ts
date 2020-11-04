import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('areas')
export class Area {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "varchar", length: 200 })
  name: string;

  @Column({ type: "varchar", length: 200, unique: true })
  slug: string;

  @Column({ type: "uuid", nullable: true })
  parentAreaId: string;

  @Column({ type: "decimal" })
  latitude: number;

  @Column({ type: "decimal" })
  longitude: number;

  @Column({ default: false })
  isDisabled: boolean;

  @Column({ default: false })
  isDeleted: boolean;
}
