import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "varchar", length: 200 })
  name: string;

  @Column({ type: "varchar", length: 200, unique: true })
  slug: string;

  @Column({ type: "varchar", nullable: true })
  imageUrl: string;

  @Column({ type: "varchar", nullable: true })
  coverImageUrl: string;

  @Column({ type: "uuid", nullable: true })
  parentCategoryId: string;

  @Column({ default: false })
  isDisabled: boolean;

  @Column({ default: false })
  isDeleted: boolean;
}
