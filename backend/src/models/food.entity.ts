import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('foods')
export class Food {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category!: string;
}
