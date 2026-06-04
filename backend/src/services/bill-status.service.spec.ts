import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillStatusService } from './bill-status.service';
import { BillStatus, BillStatusEnum } from '../models/bill-status.entity';
import { RealtimeEventsService } from '../realtime/realtime-events.service';

describe('BillStatusService', () => {
  let service: BillStatusService;
  let repository: jest.Mocked<Repository<BillStatus>>;

  const mockRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn(),
  });

  const mockBillStatus: BillStatus = {
    id: 1,
    userId: 1,
    status: BillStatusEnum.CONFIRMED,
    phone: '1234567890',
    address: '123 Main St',
    paymentMethod: 'card',
    total: 50,
    discount: 5,
    deliveryFee: 5,
    paid: true,
    isActive: true,
    shipperId: null,
    user: { id: 1, email: 'user@example.com', name: 'User' } as BillStatus['user'],
    shipper: null,
    billDetails: [
      { id: 1, foodId: 1, quantity: 2, price: 15.99, food: { id: 1, name: 'Pizza' } },
    ] as BillStatus['billDetails'],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BillStatusService,
        {
          provide: getRepositoryToken(BillStatus),
          useValue: mockRepository(),
        },
        {
          provide: RealtimeEventsService,
          useValue: { emitOrderChanged: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<BillStatusService>(BillStatusService);
    repository = module.get<jest.Mocked<Repository<BillStatus>>>(
      getRepositoryToken(BillStatus),
    );
  });

  describe('findAll', () => {
    it('should return all bill statuses sorted by createdAt descending', async () => {
      const bills = [mockBillStatus, { ...mockBillStatus, id: 2 }];
      repository.find.mockResolvedValue(bills);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(repository.find).toHaveBeenCalledWith({
        relations: { user: true, shipper: true, billDetails: { food: true } },
        order: { createdAt: 'DESC' },
      });
    });

    it('should return empty array when no bills exist', async () => {
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
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    };

    beforeEach(() => {
      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);
    });

    it('should return paginated bill statuses', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockBillStatus], 1]);

      const result = await service.findPaginated({});

      expect(result.items).toHaveLength(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.pageSize).toBe(10);
    });

    it('should filter by search query', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockBillStatus], 1]);

      await service.findPaginated({ search: '123' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('CAST'),
        expect.any(Object),
      );
    });

    it('should filter by paid status', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockBillStatus], 1]);

      await service.findPaginated({ paid: 'true' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'billStatus.paid = :paid',
        { paid: true },
      );
    });

    it('should filter by unpaid status', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockBillStatus], 1]);

      await service.findPaginated({ paid: 'false' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'billStatus.paid = :paid',
        { paid: false },
      );
    });

    it('should filter by date range', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockBillStatus], 1]);

      await service.findPaginated({
        fromDate: '2026-06-01',
        toDate: '2026-06-30',
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'billStatus.createdAt >= :fromDate',
        { fromDate: '2026-06-01 00:00:00' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'billStatus.createdAt <= :toDate',
        { toDate: '2026-06-30 23:59:59' },
      );
    });

    it('should sort by createdAt by default', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockBillStatus], 1]);

      await service.findPaginated({});

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'billStatus.createdAt',
        'DESC',
      );
    });

    it('should handle pagination with custom page size', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockBillStatus], 1]);

      await service.findPaginated({ page: 2, pageSize: 20 });

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(20);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
    });

    it('should load all required relations', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockBillStatus], 1]);

      await service.findPaginated({});

      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'billStatus.user',
        'user',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'billStatus.shipper',
        'shipper',
      );
    });
  });

  describe('findByBill', () => {
    it('should return a single bill status by id', async () => {
      repository.findOne.mockResolvedValue(mockBillStatus);

      const result = await service.findByBill(1);

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when bill status not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findByBill(999)).rejects.toThrow();
    });
  });

  describe('findByUser', () => {
    it('should find all bill statuses for a specific user', async () => {
      const userBills = [mockBillStatus];
      repository.find.mockResolvedValue(userBills);

      const result = await service.findByUser(1);

      expect(result).toHaveLength(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: { user: true, shipper: true, billDetails: { food: true } },
        order: { createdAt: 'DESC' },
      });
    });

    it('should return empty array when user has no bills', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findByUser(999);

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update bill status', async () => {
      const updateData = { status: BillStatusEnum.PREPARING };
      repository.findOne.mockResolvedValue(mockBillStatus);
      repository.save.mockResolvedValue({ ...mockBillStatus, ...updateData });

      const result = await service.update(1, updateData);

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when bill not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { status: BillStatusEnum.PREPARING })).rejects.toThrow();
    });
  });

  describe('markCancelled', () => {
    it('should cancel a bill status', async () => {
      repository.findOne.mockResolvedValueOnce(mockBillStatus);
      repository.findOne.mockResolvedValueOnce({
        ...mockBillStatus,
        status: BillStatusEnum.CANCELLED,
      });
      repository.save.mockResolvedValue({
        ...mockBillStatus,
        status: BillStatusEnum.CANCELLED,
      });

      const result = await service.markCancelled(1);

      expect(result).toBeDefined();
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when bill not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.markCancelled(999)).rejects.toThrow();
    });
  });

  describe('markPaid', () => {
    it('should mark bill as paid', async () => {
      repository.findOne.mockResolvedValueOnce(mockBillStatus);
      repository.findOne.mockResolvedValueOnce({
        ...mockBillStatus,
        paid: true,
      });
      repository.save.mockResolvedValue({ ...mockBillStatus, paid: true });

      const result = await service.markPaid(1);

      expect(result).toBeDefined();
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when bill not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.markPaid(999)).rejects.toThrow();
    });
  });
});
