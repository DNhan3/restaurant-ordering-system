import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { BookingsService } from '../services/bookings.service.js';
import { CreateBookingDto } from '../dto/create.dto.js';
import { UpdateBookingDto } from '../dto/update.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { assertSelfOrAdmin } from '../auth/request-user.js';
import type { AuthUser } from '../auth/auth.types.js';
import * as queryOptions from '../services/query-options.js';
import { AuditLogsService } from '../services/audit-logs.service.js';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly auditLogsService: AuditLogsService,
  ) { }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll(@Query() query: queryOptions.ListQueryOptions) {
    return queryOptions.hasListQuery(query)
      ? this.bookingsService.findPaginated(query)
      : this.bookingsService.findAll();
  }

  @Get('availability')
  @UseGuards(JwtAuthGuard)
  getAvailability(
    @Query('date') date: string,
    @Query('time') time: string,
    @Query('excludeId') excludeId?: string,
  ) {
    const parsedExcludeId = excludeId ? Number(excludeId) : undefined;
    return this.bookingsService.getAvailability(date, time, parsedExcludeId);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    assertSelfOrAdmin(request.user, userId);
    return this.bookingsService.findByUser(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Req() request: Request & { user: AuthUser },
  ) {
    const booking = await this.bookingsService.create(createBookingDto);
    await this.auditLogsService.record({
      actor: request.user,
      action: 'create',
      entityType: 'booking',
      entityId: booking.id,
      metadata: {
        date: booking.date,
        time: booking.time,
        people: booking.people,
        tables: booking.tables,
      },
    });
    return booking;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto,
    @Req() request: Request & { user: AuthUser },
  ) {
    return this.bookingsService.update(id, updateBookingDto).then(async (booking) => {
      await this.auditLogsService.record({
        actor: request.user,
        action: 'update',
        entityType: 'booking',
        entityId: id,
        metadata: { changedFields: Object.keys(updateBookingDto) },
      });
      return booking;
    });
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelOwnBooking(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    const booking = await this.bookingsService.findOne(id);
    assertSelfOrAdmin(request.user, booking.userId ?? -1);
    const removed = await this.bookingsService.remove(id);
    await this.auditLogsService.record({
      actor: request.user,
      action: 'cancel',
      entityType: 'booking',
      entityId: id,
      metadata: { userId: booking.userId, date: booking.date, time: booking.time },
    });
    return removed;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    const booking = await this.bookingsService.remove(id);
    await this.auditLogsService.record({
      actor: request.user,
      action: 'delete',
      entityType: 'booking',
      entityId: id,
    });
    return booking;
  }
}
