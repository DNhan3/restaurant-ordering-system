import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
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

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'shipper_id', type: 'int', nullable: true })
  shipperId!: number | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'shipper_id' })
  shipper!: User | null;

  @OneToMany(() => BillDetail, (detail) => detail.billStatus)
  billDetails!: BillDetail[];
}
