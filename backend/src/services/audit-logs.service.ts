import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../models/audit-log.entity.js';
import type { AuthUser } from '../auth/auth.types.js';
import {
  buildPaginationMeta,
  getPagination,
  getSortOrder,
  ListQueryOptions,
} from './query-options.js';

interface CreateAuditLogInput {
  actor?: AuthUser | null;
  action: string;
  entityType: string;
  entityId?: string | number | null;
  metadata?: Record<string, unknown> | null;
}

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async record(input: CreateAuditLogInput) {
    const log = this.auditLogRepository.create({
      actorUserId: input.actor?.sub ?? null,
      actorRole: input.actor?.role ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId === undefined || input.entityId === null
        ? null
        : String(input.entityId),
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    });

    return this.auditLogRepository.save(log);
  }

  async findPaginated(query: ListQueryOptions = {}) {
    const { page, pageSize, skip, take } = getPagination(query);
    const sortColumns: Record<string, string> = {
      id: 'auditLog.id',
      action: 'auditLog.action',
      entityType: 'auditLog.entityType',
      actorRole: 'auditLog.actorRole',
      createdAt: 'auditLog.createdAt',
    };
    const sortColumn = sortColumns[String(query.sortBy || 'createdAt')] ?? sortColumns.createdAt;
    const qb = this.auditLogRepository.createQueryBuilder('auditLog');

    if (query.search) {
      qb.andWhere(
        '(LOWER(auditLog.action) LIKE :search OR LOWER(auditLog.entityType) LIKE :search OR auditLog.entityId LIKE :rawSearch OR LOWER(auditLog.metadata) LIKE :search)',
        {
          search: `%${String(query.search).toLowerCase()}%`,
          rawSearch: `%${String(query.search)}%`,
        },
      );
    }

    if (query.action && query.action !== 'all') {
      qb.andWhere('auditLog.action = :action', { action: query.action });
    }

    if (query.entityType && query.entityType !== 'all') {
      qb.andWhere('auditLog.entityType = :entityType', {
        entityType: query.entityType,
      });
    }

    if (query.actorRole && query.actorRole !== 'all') {
      qb.andWhere('auditLog.actorRole = :actorRole', {
        actorRole: query.actorRole,
      });
    }

    if (query.fromDate) {
      qb.andWhere('auditLog.createdAt >= :fromDate', {
        fromDate: `${query.fromDate} 00:00:00`,
      });
    }

    if (query.toDate) {
      qb.andWhere('auditLog.createdAt <= :toDate', {
        toDate: `${query.toDate} 23:59:59`,
      });
    }

    const [logs, total] = await qb
      .orderBy(sortColumn, getSortOrder(query.sortOrder))
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      items: logs.map((log) => ({
        ...log,
        metadata: log.metadata ? JSON.parse(log.metadata) : null,
      })),
      meta: buildPaginationMeta(page, pageSize, total),
    };
  }
}
