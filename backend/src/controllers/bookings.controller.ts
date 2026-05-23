import { Controller, Post, Body } from '@nestjs/common';
import { BookingsService } from '../services/bookings.service.js';
import { CreateBookingDto } from '../dto/create-booking.dto.js';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }
}
