import { Controller, Get, Post, Param, Body, ParseIntPipe, Req, UseGuards, NotFoundException } from '@nestjs/common';
import type { Request } from 'express';
import { BillDetailsService } from '../services/bill-details.service.js';
import { BillStatusService } from '../services/bill-status.service.js';
import { CreateBillDetailDto } from '../dto/create.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { assertSelfOrAdmin } from '../auth/request-user.js';
import type { AuthUser } from '../auth/auth.types.js';

@Controller('bill-details')
export class BillDetailsController {
  constructor(
    private readonly billDetailsService: BillDetailsService,
    private readonly billStatusService: BillStatusService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createBillDetailDto: CreateBillDetailDto) {
    return this.billDetailsService.create(createBillDetailDto);
  }

  @Get('bill/:billStatusId')
  @UseGuards(JwtAuthGuard)
  async findByBillStatus(
    @Param('billStatusId', ParseIntPipe) billStatusId: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    const bill = await this.billStatusService.findByBill(billStatusId);
    if (!bill) {
      throw new NotFoundException(`Bill with id ${billStatusId} not found`);
    }
    assertSelfOrAdmin(request.user, bill.user_id);
    return this.billDetailsService.findByBillStatus(billStatusId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    const detail = await this.billDetailsService.findOne(id);
    if (!detail) {
      throw new NotFoundException(`Bill detail with id ${id} not found`);
    }
    const bill = await this.billStatusService.findByBill(detail.bill_status_id);
    if (!bill) {
      throw new NotFoundException(`Bill with id ${detail.bill_status_id} not found`);
    }
    assertSelfOrAdmin(request.user, bill.user_id);
    return detail;
  }
}
