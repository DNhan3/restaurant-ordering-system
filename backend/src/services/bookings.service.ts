import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../models/booking.entity.js';
import { CreateBookingDto } from '../dto/create.dto.js';
import { UpdateBookingDto } from '../dto/update.dto.js';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) { }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({
      relations: { user: true },
      order: { date: 'DESC', time: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Booking> {
    return this.findEntity(id);
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

  async update(id: number, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findEntity(id);
    const updateData: Partial<Booking> = {};

    if (updateBookingDto.book_name !== undefined) {
      updateData.name = updateBookingDto.book_name;
    }
    if (updateBookingDto.book_phone !== undefined) {
      updateData.phone = String(updateBookingDto.book_phone);
    }
    if (updateBookingDto.book_people !== undefined) {
      updateData.people = updateBookingDto.book_people;
    }
    if (updateBookingDto.book_tables !== undefined) {
      updateData.tables = updateBookingDto.book_tables;
    }
    if (updateBookingDto.user_id !== undefined) {
      updateData.userId = updateBookingDto.user_id;
    }
    if (updateBookingDto.book_note !== undefined) {
      updateData.note = updateBookingDto.book_note || null;
    }
    if (updateBookingDto.book_when !== undefined) {
      const bookingDate = new Date(updateBookingDto.book_when);
      updateData.date = bookingDate.toISOString().slice(0, 10);
      updateData.time = bookingDate.toTimeString().slice(0, 5);
    }

    Object.assign(booking, updateData);
    await this.bookingRepository.save(booking);
    return this.findEntity(id);
  }

  async remove(id: number): Promise<Booking> {
    const booking = await this.findEntity(id);
    await this.bookingRepository.remove(booking);
    return booking;
  }

  private async findEntity(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    return booking;
  }
}
