import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../models/booking.entity.js';
import { CreateBookingDto } from '../dto/create.dto.js';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) { }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({
      relations: { user: true },
    });
  }

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const bookingDate = new Date(createBookingDto.book_when);
    const date = bookingDate.toISOString().slice(0, 10);
    const time = bookingDate.toTimeString().slice(0, 5);

    const booking = this.bookingRepository.create({
      userId: createBookingDto.user_id,
      name: createBookingDto.book_name,
      date,
      time,
      phone: String(createBookingDto.book_phone),
      people: createBookingDto.book_people,
      tables: createBookingDto.book_tables,
      note: createBookingDto.book_note || null,
    });

    return this.bookingRepository.save(booking);
  }
}
