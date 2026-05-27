import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity.js';
import { BillDetail } from './bill-detail.entity.js';

export enum BillStatusEnum {
  CANCELLED = 'cancelled',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  CHECKING = 'checking',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  PENDING = 'pending',
  PAID = 'paid',
}

@Entity('bill_status')
export class BillStatus {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({
    type: 'enum',
    enum: BillStatusEnum,
    default: BillStatusEnum.CONFIRMED,
  })
  status!: BillStatusEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount!: number;

  @Column({ name: 'delivery_fee', type: 'decimal', precision: 10, scale: 2, default: 0 })
  deliveryFee!: number;

  @Column({ type: 'varchar', length: 20, default: '' })
  phone!: string;

  @Column({ type: 'text', nullable: true })
  address!: string | null;

  @Column({ name: 'payment_method', type: 'varchar', length: 20, default: 'cash' })
  paymentMethod!: string;

  @Column({ type: 'boolean', default: false })
  paid!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => BillDetail, (detail) => detail.billStatus)
  billDetails!: BillDetail[];
}
