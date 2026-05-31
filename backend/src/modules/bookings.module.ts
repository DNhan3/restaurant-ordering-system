import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../models/booking.entity.js';
import { BookingsService } from '../services/bookings.service.js';
import { BookingsController } from '../controllers/bookings.controller.js';
import { AuthModule } from './auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), AuthModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
