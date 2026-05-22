import { Body, Controller, Get, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('booking')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  getBookings() {
    return this.bookingsService.findCustomerBookings();
  }

  @Post()
  createBooking(@Body() body: unknown) {
    return this.bookingsService.create(body);
  }
}
