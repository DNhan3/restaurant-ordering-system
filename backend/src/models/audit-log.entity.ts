import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'actor_user_id', type: 'int', nullable: true })
  actorUserId!: number | null;

  @Column({ name: 'actor_role', type: 'varchar', length: 50, nullable: true })
  actorRole!: string | null;

  @Column({ type: 'varchar', length: 100 })
  action!: string;

  @Column({ name: 'entity_type', type: 'varchar', length: 100 })
  entityType!: string;

  @Column({ name: 'entity_id', type: 'varchar', length: 100, nullable: true })
  entityId!: string | null;

  @Column({ type: 'text', nullable: true })
  metadata!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
