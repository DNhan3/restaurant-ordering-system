import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../models/audit-log.entity.js';
import { AuditLogsController } from '../controllers/audit-logs.controller.js';
import { AuditLogsService } from '../services/audit-logs.service.js';
import { JwtTokenService } from '../auth/jwt-token.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditLogsController],
  providers: [AuditLogsService, JwtTokenService, JwtAuthGuard, RolesGuard],
  exports: [AuditLogsService],
})
export class AuditLogsModule {}
