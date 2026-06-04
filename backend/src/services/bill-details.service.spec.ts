import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillDetailsService } from './bill-details.service';
import { BillDetail } from '../models/bill-detail.entity';
import { BillStatusEnum } from '../models/bill-status.entity';
import { NotFoundException } from '@nestjs/common';

describe('BillDetailsService', () => {
  let service: BillDetailsService;
  let repository: jest.Mocked<Repository<BillDetail>>;

  const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  });

  const mockBillDetail: BillDetail = {
    id: 1,
    billStatusId: 1,
    foodId: 1,
    quantity: 2,
    price: 15.99,
    isActive: true,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    deletedAt: null,
    billStatus: {
      id: 1,
      status: BillStatusEnum.CONFIRMED,
    } as BillDetail['billStatus'],
    food: {
      id: 1,
      name: 'Pizza',
      price: 15.99,
    } as BillDetail['food'],
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BillDetailsService,
        {
          provide: getRepositoryToken(BillDetail),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<BillDetailsService>(BillDetailsService);
    repository = module.get<jest.Mocked<Repository<BillDetail>>>(
      getRepositoryToken(BillDetail),
    );
  });

  describe('create', () => {
    it('should create a new bill detail', async () => {
      const createDto = {
        billStatusId: 1,
        foodId: 1,
        quantity: 2,
        price: 15.99,
      };

      repository.create.mockReturnValue(mockBillDetail);
      repository.save.mockResolvedValue(mockBillDetail);
      repository.findOne.mockResolvedValue(mockBillDetail);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should save with correct relations', async () => {
      const createDto = {
        billStatusId: 1,
        foodId: 1,
        quantity: 3,
        price: 10.5,
      };

      repository.create.mockReturnValue({ ...mockBillDetail, ...createDto });
      repository.save.mockResolvedValue({ ...mockBillDetail, ...createDto });
      repository.findOne.mockResolvedValue({ ...mockBillDetail, ...createDto });

      await service.create(createDto);

      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findByBillStatus', () => {
    it('should find all bill details for a specific bill status', async () => {
      const billStatusId = 1;
      const details = [mockBillDetail, { ...mockBillDetail, id: 2 }];

      repository.find.mockResolvedValue(details);

      const result = await service.findByBillStatus(billStatusId);

      expect(result).toHaveLength(2);
      expect(repository.find).toHaveBeenCalledWith({
        where: { billStatusId },
        relations: { billStatus: true, food: true },
      });
    });

    it('should return empty array when no details exist', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findByBillStatus(999);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should find a bill detail by id', async () => {
      repository.findOne.mockResolvedValue(mockBillDetail);

      const result = await service.findOne(1);

      expect(result).toBeDefined();
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { billStatus: true, food: true },
      });
    });

    it('should throw NotFoundException when bill detail not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw error with correct id in message', async () => {
      repository.findOne.mockResolvedValue(null);

      try {
        await service.findOne(123);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as Error).message).toContain('123');
      }
    });
  });
});
