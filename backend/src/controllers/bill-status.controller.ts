import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
  Body,
  ParseIntPipe,
  Query,
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
import { hasListQuery } from '../services/query-options.js';
import type { ListQueryOptions } from '../services/query-options.js';
import { AuditLogsService } from '../services/audit-logs.service.js';

@Controller('bill-status')
export class BillStatusController {
  constructor(
    private readonly billStatusService: BillStatusService,
    private readonly auditLogsService: AuditLogsService,
  ) { }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll(@Query() query: ListQueryOptions) {
    return hasListQuery(query)
      ? this.billStatusService.findPaginated(query)
      : this.billStatusService.findAll();
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
    return this.billStatusService.create(safeDto).then(async (bill) => {
      await this.auditLogsService.record({
        actor: request.user,
        action: 'create',
        entityType: 'order',
        entityId: bill?.bill_id,
        metadata: { total: bill?.bill_total, userId: bill?.user_id },
      });
      return bill;
    });
  }

  @Put('paid/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  markPaid(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    return this.billStatusService.markPaid(id).then(async (bill) => {
      await this.auditLogsService.record({
        actor: request.user,
        action: 'mark_paid',
        entityType: 'order',
        entityId: id,
      });
      return bill;
    });
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
    return this.billStatusService.markCancelled(id).then(async (bill) => {
      await this.auditLogsService.record({
        actor: request.user,
        action: 'cancel',
        entityType: 'order',
        entityId: id,
      });
      return bill;
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBillStatusDto: UpdateBillStatusDto,
    @Req() request: Request & { user: AuthUser },
  ) {
    return this.billStatusService.update(id, updateBillStatusDto).then(async (bill) => {
      await this.auditLogsService.record({
        actor: request.user,
        action: 'update',
        entityType: 'order',
        entityId: id,
        metadata: { changedFields: Object.keys(updateBillStatusDto), status: bill?.bill_status },
      });
      return bill;
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    await this.billStatusService.remove(id);
    await this.auditLogsService.record({
      actor: request.user,
      action: 'delete',
      entityType: 'order',
      entityId: id,
    });
  }
}
