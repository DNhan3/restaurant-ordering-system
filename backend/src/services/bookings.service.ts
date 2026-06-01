import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../models/booking.entity.js';
import { CreateBookingDto } from '../dto/create.dto.js';
import { UpdateBookingDto } from '../dto/update.dto.js';
import { ConfigService } from '@nestjs/config';
import {
  buildPaginationMeta,
  getPagination,
  getSortOrder,
  ListQueryOptions,
} from './query-options.js';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly configService: ConfigService,
  ) { }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({
      relations: { user: true },
      order: { date: 'DESC', time: 'DESC' },
    });
  }

  async findPaginated(query: ListQueryOptions) {
    const { page, pageSize, skip, take } = getPagination(query);
    const sortColumns: Record<string, string> = {
      id: 'booking.id',
      name: 'booking.name',
      date: 'booking.date',
      time: 'booking.time',
      people: 'booking.people',
      tables: 'booking.tables',
      createdAt: 'booking.createdAt',
      updatedAt: 'booking.updatedAt',
    };
    const sortColumn = sortColumns[String(query.sortBy || 'date')] ?? sortColumns.date;

    const qb = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user');

    if (query.search) {
      qb.andWhere(
        '(LOWER(booking.name) LIKE :search OR booking.phone LIKE :rawSearch OR LOWER(booking.note) LIKE :search)',
        {
          search: `%${String(query.search).toLowerCase()}%`,
          rawSearch: `%${String(query.search)}%`,
        },
      );
    }

    if (query.date) {
      qb.andWhere('booking.date = :date', { date: query.date });
    }

    if (query.fromDate) {
      qb.andWhere('booking.date >= :fromDate', { fromDate: query.fromDate });
    }

    if (query.toDate) {
      qb.andWhere('booking.date <= :toDate', { toDate: query.toDate });
    }

    if (query.active !== undefined && query.active !== 'all') {
      qb.andWhere('booking.isActive = :active', {
        active: String(query.active) === 'true',
      });
    }

    const [bookings, total] = await qb
      .orderBy(sortColumn, getSortOrder(query.sortOrder))
      .addOrderBy('booking.time', getSortOrder(query.sortOrder))
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      items: bookings,
      meta: buildPaginationMeta(page, pageSize, total),
    };
  }

  async findOne(id: number): Promise<Booking> {
    return this.findEntity(id);
  }

  async findByUser(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { userId },
      relations: { user: true },
      order: { date: 'DESC', time: 'DESC' },
    });
  }

  async getAvailability(date: string, time: string, excludeId?: number) {
    const TOTAL_RESTAURANT_TABLES = this.getTotalRestaurantTables();
    if (!date || !time) {
      throw new BadRequestException('date and time are required');
    }

    const reservedTables = await this.getReservedTables(date, time, excludeId);
    const availableTables = Math.max(TOTAL_RESTAURANT_TABLES - reservedTables, 0);

    return {
      date,
      time,
      totalTables: TOTAL_RESTAURANT_TABLES,
      reservedTables,
      availableTables,
      isAvailable: availableTables > 0,
    };
  }

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const bookingDate = new Date(createBookingDto.book_when);
    const date = bookingDate.toISOString().slice(0, 10);
    const time = bookingDate.toTimeString().slice(0, 5);
    const tables = this.calculateRequiredTables(createBookingDto.book_people);
    await this.assertTablesAvailable(date, time, tables);

    const booking = this.bookingRepository.create({
      userId: createBookingDto.user_id,
      name: createBookingDto.book_name,
      date,
      time,
      phone: String(createBookingDto.book_phone),
      people: createBookingDto.book_people,
      tables,
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

    updateData.tables = this.calculateRequiredTables(updateData.people ?? booking.people);

    await this.assertTablesAvailable(
      updateData.date ?? booking.date,
      updateData.time ?? booking.time,
      updateData.tables,
      id,
    );

    Object.assign(booking, updateData);
    await this.bookingRepository.save(booking);
    return this.findEntity(id);
  }

  async remove(id: number): Promise<Booking> {
    const booking = await this.findEntity(id);
    booking.isActive = false;
    await this.bookingRepository.save(booking);
    await this.bookingRepository.softRemove(booking);
    return booking;
  }

  private async assertTablesAvailable(
    date: string,
    time: string,
    requestedTables: number,
    excludeId?: number,
  ) {
    if (!Number.isInteger(requestedTables) || requestedTables < 1) {
      throw new BadRequestException('At least one table is required');
    }

    const totalTables = this.getTotalRestaurantTables();
    const reservedTables = await this.getReservedTables(date, time, excludeId);
    const availableTables = totalTables - reservedTables;

    if (requestedTables > availableTables) {
      throw new BadRequestException(
        `Only ${Math.max(availableTables, 0)} table(s) available for ${date} ${time}`,
      );
    }
  }

  private async getReservedTables(date: string, time: string, excludeId?: number) {
    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .select('COALESCE(SUM(booking.tables), 0)', 'reservedTables')
      .where('booking.date = :date', { date })
      .andWhere('booking.time = :time', { time })
      .andWhere('booking.deleted_at IS NULL')
      .andWhere('booking.is_active = :isActive', { isActive: true });

    if (excludeId) {
      query.andWhere('booking.id != :excludeId', { excludeId });
    }

    const result = await query.getRawOne<{ reservedTables: string | number | null }>();
    return Number(result?.reservedTables ?? 0);
  }

  private calculateRequiredTables(people: number): number {
    if (!Number.isInteger(people) || people < 1) {
      throw new BadRequestException('At least one person is required');
    }

    return Math.ceil(people / this.getSeatsPerTable());
  }

  private getSeatsPerTable(): number {
    const seatsPerTable = Number(this.configService.get('BOOKING_SEATS_PER_TABLE') || 4);
    return Number.isInteger(seatsPerTable) && seatsPerTable > 0 ? seatsPerTable : 4;
  }

  private getTotalRestaurantTables(): number {
    const totalTables = Number(this.configService.get('TOTAL_RESTAURANT_TABLES') || 20);
    return Number.isInteger(totalTables) && totalTables > 0 ? totalTables : 20;
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
