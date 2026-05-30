import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { BillingService } from '../services/billing.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import type { AuthUser } from '../auth/auth.types.js';

@Controller()
export class CheckoutController {
  constructor(private readonly billingService: BillingService) { }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  checkout(@Body() body: Record<string, unknown>, @Req() request: Request & { user: AuthUser }) {
    const safeBody =
      request.user.role === 'admin'
        ? body
        : { ...body, userId: request.user.sub, user_id: request.user.sub };
    return this.billingService.checkout(safeBody);
  }
}
