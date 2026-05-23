import { Module } from '@nestjs/common';
import { OrdersController } from '../controllers/orders.controller.js';
import { OrdersService } from '../services/orders.service.js';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
