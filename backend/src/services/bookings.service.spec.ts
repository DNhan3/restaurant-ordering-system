import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingsService } from './bookings.service';
import { Booking } from '../models/booking.entity';
import { ConfigService } from '@nestjs/config';

describe('BookingsService', () => {
  let service: BookingsService;
  let repository: jest.Mocked<Repository<Booking>>;
  let configService: jest.Mocked<ConfigService>;

  const mockRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    findBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  });

  const mockBooking = {
    id: 1,
    name: 'John Doe',
    phone: '1234567890',
    date: '2026-06-15',
    time: '19:00',
    people: 4,
    tables: 2,
    note: 'Window seat preferred',
    isActive: true,
    userId: 1,
    user: { id: 1, email: 'john@example.com', name: 'John Doe' },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockRepository(),
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    repository = module.get<jest.Mocked<Repository<Booking>>>(
      getRepositoryToken(Booking),
    );
    configService = module.get<jest.Mocked<ConfigService>>(ConfigService);
  });

  describe('findAll', () => {
    it('should return all bookings sorted by date and time descending', async () => {
      const mockBookings = [mockBooking, { ...mockBooking, id: 2 }];
      repository.find.mockResolvedValue(mockBookings);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(repository.find).toHaveBeenCalledWith({
        relations: { user: true },
        order: { date: 'DESC', time: 'DESC' },
      });
    });

    it('should return empty array when no bookings exist', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findPaginated', () => {
    const mockQueryBuilder = {
      createQueryBuilder: jest.fn(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    };

    beforeEach(() => {
      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);
    });

    it('should return paginated bookings', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue(
        [[mockBooking], 1],
      );

      const result = await service.findPaginated({});

      expect(result.items).toHaveLength(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.pageSize).toBe(10);
    });

    it('should filter by search query', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue(
        [[mockBooking], 1],
      );

      await service.findPaginated({ search: 'John' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(LOWER(booking.name) LIKE :search OR booking.phone LIKE :rawSearch OR LOWER(booking.note) LIKE :search)',
        expect.any(Object),
      );
    });

    it('should filter by specific date', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue(
        [[mockBooking], 1],
      );

      await service.findPaginated({ date: '2026-06-15' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'booking.date = :date',
        { date: '2026-06-15' },
      );
    });

    it('should filter by date range', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue(
        [[mockBooking], 1],
      );

      await service.findPaginated({
        fromDate: '2026-06-01',
        toDate: '2026-06-30',
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'booking.date >= :fromDate',
        { fromDate: '2026-06-01' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'booking.date <= :toDate',
        { toDate: '2026-06-30' },
      );
    });

    it('should filter by active status', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue(
        [[mockBooking], 1],
      );

      await service.findPaginated({ active: 'true' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'booking.isActive = :active',
        { active: true },
      );
    });

    it('should sort by date by default', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue(
        [[mockBooking], 1],
      );

      await service.findPaginated({});

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'booking.date',
        'DESC',
      );
      expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledWith(
        'booking.time',
        'DESC',
      );
    });

    it('should handle pagination with custom page size', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue(
        [[mockBooking], 1],
      );

      await service.findPaginated({ page: 2, pageSize: 20 });

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(20);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
    });
  });

  describe('findOne', () => {
    it('should return a single booking by id', async () => {
      repository.findOne.mockResolvedValue(mockBooking);

      const result = await service.findOne(1);

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when booking not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow();
    });
  });

  describe('findByUser', () => {
    it('should return bookings for a specific user', async () => {
      const userBookings = [mockBooking];
      repository.find.mockResolvedValue(userBookings);

      const result = await service.findByUser(1);

      expect(result).toHaveLength(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: { user: true },
        order: { date: 'DESC', time: 'DESC' },
      });
    });

    it('should return empty array when user has no bookings', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findByUser(999);

      expect(result).toEqual([]);
    });
  });
});
