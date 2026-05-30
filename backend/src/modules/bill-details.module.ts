import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillDetail } from '../models/bill-detail.entity.js';
import { BillDetailsService } from '../services/bill-details.service.js';
import { BillDetailsController } from '../controllers/bill-details.controller.js';
import { AuthModule } from './auth.module.js';
import { BillStatusModule } from './bill-status.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([BillDetail]), AuthModule, BillStatusModule],
  controllers: [BillDetailsController],
  providers: [BillDetailsService],
  exports: [BillDetailsService],
})
export class BillDetailsModule {}
