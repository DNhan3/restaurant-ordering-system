import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BillStatus } from './bill-status.entity.js';
import { Food } from './food.entity.js';

@Entity('bill_details')
export class BillDetail {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'bill_status_id' })
  billStatusId!: number;

  @Column({ name: 'food_id' })
  foodId!: number;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @ManyToOne(() => BillStatus, (billStatus) => billStatus.billDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bill_status_id' })
  billStatus!: BillStatus;

  @ManyToOne(() => Food, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'food_id' })
  food!: Food;
}
