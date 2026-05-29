import { Body, Controller, Post } from '@nestjs/common';
import { BillingService } from '../services/billing.service.js';

@Controller()
export class CheckoutController {
  constructor(private readonly billingService: BillingService) { }

  @Post('checkout')
  checkout(@Body() body: unknown) {
    return this.billingService.checkout(body);
  }
}