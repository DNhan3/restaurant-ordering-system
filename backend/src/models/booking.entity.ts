import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity.js';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', nullable: true })
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

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user!: User | null;
}
