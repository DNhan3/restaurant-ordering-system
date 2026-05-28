import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BillingService } from '../services/billing.service.js';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('summary')
  getSummary() {
    return this.billingService.getSummary();
  }

  @Get('user/:userId')
  findUserInvoices(@Param('userId', ParseIntPipe) userId: number) {
    return this.billingService.findUserInvoices(userId);
  }

  @Get('invoice/:id')
  findInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.billingService.findInvoice(id);
  }
}
