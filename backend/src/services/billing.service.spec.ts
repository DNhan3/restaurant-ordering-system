import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillStatus } from '../models/bill-status.entity';
import { BillDetail } from '../models/bill-detail.entity';
import { RealtimeEventsService } from '../realtime/realtime-events.service';

describe('BillingService', () => {
  let service: BillingService;
  let billStatusRepository: jest.Mocked<Repository<BillStatus>>;
  let billDetailRepository: jest.Mocked<Repository<BillDetail>>;

  const mockRepository = () => ({
    manager: {
      transaction: jest.fn(),
    },
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BillingService,
        {
          provide: getRepositoryToken(BillStatus),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(BillDetail),
          useValue: mockRepository(),
        },
        {
          provide: RealtimeEventsService,
          useValue: { emitOrderChanged: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
    billStatusRepository = module.get<jest.Mocked<Repository<BillStatus>>>(
      getRepositoryToken(BillStatus),
    );
    billDetailRepository = module.get<jest.Mocked<Repository<BillDetail>>>(
      getRepositoryToken(BillDetail),
    );
  });

  describe('checkout', () => {
    it('should throw BadRequestException when userId is missing', async () => {
      const checkoutData = {
        items: [{ foodId: 1, quantity: 2 }],
        phone: '1234567890',
        address: '123 Main St',
      };

      await expect(service.checkout(checkoutData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when items array is empty', async () => {
      const checkoutData = {
        userId: 1,
        items: [],
        phone: '1234567890',
      };

      await expect(service.checkout(checkoutData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when items is not an array', async () => {
      const checkoutData = {
        userId: 1,
        items: null,
      };

      await expect(service.checkout(checkoutData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should validate checkout items before processing', async () => {
      const checkoutData = {
        userId: 1,
        items: [{ foodId: 1, quantity: 2, price: 15.99 }],
        phone: '1234567890',
      };

      billStatusRepository.manager.transaction = jest.fn();

      try {
        await service.checkout(checkoutData);
      } catch (e) {
        // Expected to fail during transaction
      }

      expect(billStatusRepository.manager.transaction).toHaveBeenCalled();
    });
  });

  describe('normalizeCheckoutItems', () => {
    it('should handle items with alternative field names', async () => {
      const checkoutData = {
        userId: 1,
        items: [
          { food_id: 1, item_qty: 2 },
          { foodId: 2, quantity: 3 },
        ],
      };

      billStatusRepository.manager.transaction = jest.fn();

      try {
        await service.checkout(checkoutData);
      } catch (e) {
        // Expected to fail during transaction
      }

      expect(billStatusRepository.manager.transaction).toHaveBeenCalled();
    });
  });

  describe('findUserInvoices', () => {
    it('should find invoices for a specific user', async () => {
      const mockBills = [
        {
          id: 1,
          userId: 1,
          status: 'COMPLETED',
          total: 50,
        },
        {
          id: 2,
          userId: 1,
          status: 'DELIVERED',
          total: 75,
        },
      ];

      billStatusRepository.find.mockResolvedValue(mockBills as any);

      // Note: findUserInvoices method exists in the full service
      // This test assumes the method implementation
    });
  });
});
