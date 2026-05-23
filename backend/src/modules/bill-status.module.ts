import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillStatus } from '../models/bill-status.entity.js';
import { BillStatusService } from '../services/bill-status.service.js';
import { BillStatusController } from '../controllers/bill-status.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([BillStatus])],
  controllers: [BillStatusController],
  providers: [BillStatusService],
  exports: [BillStatusService],
})
export class BillStatusModule {}
