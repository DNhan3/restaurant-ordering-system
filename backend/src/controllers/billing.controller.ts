import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { BillingService } from '../services/billing.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { assertSelfOrAdmin } from '../auth/request-user.js';
import type { AuthUser } from '../auth/auth.types.js';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getSummary() {
    return this.billingService.getSummary();
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  findUserInvoices(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    assertSelfOrAdmin(request.user, userId);
    return this.billingService.findUserInvoices(userId);
  }

  @Get('invoice/:id')
  @UseGuards(JwtAuthGuard)
  async findInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    const invoice = await this.billingService.findInvoice(id);
    assertSelfOrAdmin(request.user, invoice.user_id);
    return invoice;
  }
}
