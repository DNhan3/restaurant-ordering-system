import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingController } from '../controllers/billing.controller.js';
import { CheckoutController } from '../controllers/checkout.controller.js';
import { BillDetail } from '../models/bill-detail.entity.js';
import { BillStatus } from '../models/bill-status.entity.js';
import { BillingService } from '../services/billing.service.js';
import { AuthModule } from './auth.module.js';
import { RealtimeModule } from './realtime.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([BillStatus, BillDetail]), AuthModule, RealtimeModule],
  controllers: [BillingController, CheckoutController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
