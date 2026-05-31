import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  ParseIntPipe,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';
import { BillStatusService } from '../services/bill-status.service.js';
import { CreateBillStatusDto } from '../dto/create.dto.js';
import { UpdateBillStatusDto } from '../dto/update.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { assertSelfOrAdmin } from '../auth/request-user.js';
import type { AuthUser } from '../auth/auth.types.js';

@Controller('bill-status')
export class BillStatusController {
  constructor(private readonly billStatusService: BillStatusService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.billStatusService.findAll();
  }

  @Get('new')
  @UseGuards(JwtAuthGuard)
  getNextBillId() {
    return this.billStatusService.getNextBillId();
  }

  @Get('user/:id')
  @UseGuards(JwtAuthGuard)
  findByUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    assertSelfOrAdmin(request.user, id);
    return this.billStatusService.findByUser(id);
  }

  @Get('bill/:id')
  @UseGuards(JwtAuthGuard)
  async findByBill(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    const bill = await this.billStatusService.findByBill(id);
    if (!bill) {
      throw new NotFoundException(`Bill with id ${id} not found`);
    }
    assertSelfOrAdmin(request.user, bill.user_id);
    return bill;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createBillStatusDto: CreateBillStatusDto,
    @Req() request: Request & { user: AuthUser },
  ) {
    const safeDto =
      request.user.role === 'admin'
        ? createBillStatusDto
        : { ...createBillStatusDto, userId: request.user.sub };
    return this.billStatusService.create(safeDto);
  }

  @Put('paid/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  markPaid(@Param('id', ParseIntPipe) id: number) {
    return this.billStatusService.markPaid(id);
  }

  @Put('cancel/:id')
  @UseGuards(JwtAuthGuard)
  async markCancelled(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    if (request.user.role !== 'admin') {
      const bill = await this.billStatusService.findByBill(id);
      if (!bill) {
        throw new NotFoundException(`Bill with id ${id} not found`);
      }
      assertSelfOrAdmin(request.user, bill.user_id);
    }
    return this.billStatusService.markCancelled(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBillStatusDto: UpdateBillStatusDto,
  ) {
    return this.billStatusService.update(id, updateBillStatusDto);
  }
}
