import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillDetail } from '../models/bill-detail.entity.js';
import { BillDetailsService } from '../services/bill-details.service.js';
import { BillDetailsController } from '../controllers/bill-details.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([BillDetail])],
  controllers: [BillDetailsController],
  providers: [BillDetailsService],
  exports: [BillDetailsService],
})
export class BillDetailsModule {}
