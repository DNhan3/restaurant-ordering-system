import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../models/booking.entity.js';
import { BookingsService } from '../services/bookings.service.js';
import { BookingsController } from '../controllers/bookings.controller.js';
import { AuthModule } from './auth.module.js';
import { AuditLogsModule } from './audit-logs.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), AuthModule, AuditLogsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
