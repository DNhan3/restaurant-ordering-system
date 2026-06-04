import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillStatus } from '../models/bill-status.entity.js';
import { BillStatusService } from '../services/bill-status.service.js';
import { BillStatusController } from '../controllers/bill-status.controller.js';
import { AuthModule } from './auth.module.js';
import { AuditLogsModule } from './audit-logs.module.js';
import { RealtimeModule } from './realtime.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([BillStatus]), AuthModule, AuditLogsModule, RealtimeModule],
  controllers: [BillStatusController],
  providers: [BillStatusService],
  exports: [BillStatusService],
})
export class BillStatusModule {}
