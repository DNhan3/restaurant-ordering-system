import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity.js';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', type: 'int', nullable: true })
  userId!: number | null;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'varchar', length: 10 })
  time!: string;

  @Column({ type: 'varchar', length: 20 })
  phone!: string;

  @Column({ type: 'int', default: 1 })
  people!: number;

  @Column({ type: 'int', default: 1 })
  tables!: number;

  @Column({ type: 'text', nullable: true })
  note!: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user!: User | null;
}
