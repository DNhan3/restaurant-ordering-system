import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from '../controllers/orders.controller.js';
import { OrdersService } from '../services/orders.service.js';
import { BillStatus } from '../models/bill-status.entity.js';
import { BillDetail } from '../models/bill-detail.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([BillStatus, BillDetail])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
