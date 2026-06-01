import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogsService } from '../services/audit-logs.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import type { ListQueryOptions } from '../services/query-options.js';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  findAll(@Query() query: ListQueryOptions) {
    return this.auditLogsService.findPaginated(query);
  }
}
