import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ShipperService } from './shipper.service';
import { BillStatus, BillStatusEnum } from '../models/bill-status.entity';
import { RealtimeEventsService } from '../realtime/realtime-events.service';

describe('ShipperService', () => {
  let service: ShipperService;
  let repository: jest.Mocked<Repository<BillStatus>>;

  const mockRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn(),
  });

  const mockShipper = { id: 1, name: 'Shipper' } as BillStatus['shipper'];

  const mockBill: BillStatus = {
    id: 1,
    status: BillStatusEnum.CONFIRMED,
    userId: 1,
    shipperId: null,
    phone: '1234567890',
    address: '123 Main St',
    paymentMethod: 'cash',
    total: 50,
    discount: 0,
    deliveryFee: 0,
    paid: true,
    isActive: true,
    user: { id: 1, name: 'User' } as BillStatus['user'],
    shipper: null,
    billDetails: [
      { id: 1, foodId: 1, quantity: 2, food: { id: 1, name: 'Pizza' } },
    ] as BillStatus['billDetails'],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ShipperService,
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

    service = module.get<ShipperService>(ShipperService);
    repository = module.get<jest.Mocked<Repository<BillStatus>>>(
      getRepositoryToken(BillStatus),
    );
  });

  describe('availableOrders', () => {
    it('should return orders with no shipper in available statuses', async () => {
      const orders = [
        mockBill,
        {
          ...mockBill,
          id: 2,
          status: BillStatusEnum.PREPARING,
        },
      ];
      repository.find.mockResolvedValue(orders);

      const result = await service.availableOrders();

      expect(result).toHaveLength(2);
      expect(repository.find).toHaveBeenCalledWith({
        where: expect.objectContaining({
          shipperId: expect.anything(),
          status: expect.anything(),
        }),
        relations: expect.objectContaining({
          user: true,
          shipper: true,
        }),
        order: { createdAt: 'ASC' },
      });
    });

    it('should return empty array when no available orders', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.availableOrders();

      expect(result).toEqual([]);
    });

    it('should not include orders with assigned shipper', async () => {
      const ordersWithShipper = [
        {
          ...mockBill,
          shipperId: 1,
          shipper: mockShipper,
        },
      ];
      repository.find.mockResolvedValue([]);

      const result = await service.availableOrders();

      expect(result).toEqual([]);
    });
  });

  describe('myOrder', () => {
    it('should return the shipper\'s active order', async () => {
      const activeOrder = {
        ...mockBill,
        shipperId: 1,
        status: BillStatusEnum.DELIVERING,
        shipper: mockShipper,
      };

      repository.findOne.mockResolvedValue(activeOrder);

      const result = await service.myOrder(1);

      expect(result).toBeDefined();
      expect(repository.findOne).toHaveBeenCalledWith({
        where: expect.objectContaining({
          shipperId: 1,
          status: expect.anything(),
        }),
        relations: expect.objectContaining({
          user: true,
          shipper: true,
        }),
      });
    });

    it('should return null when shipper has no active order', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.myOrder(999);

      expect(result).toBeNull();
    });

    it('should only return orders in active statuses', async () => {
      const completedOrder = {
        ...mockBill,
        shipperId: 1,
        status: BillStatusEnum.COMPLETED,
      };
      repository.findOne.mockResolvedValue(null);

      const result = await service.myOrder(1);

      expect(result).toBeNull();
    });
  });

  describe('accept', () => {
    it('should accept an available order', async () => {
      repository.findOne.mockResolvedValueOnce(null); // For checking active orders
      repository.findOne.mockResolvedValueOnce(mockBill); // For finding the order
      repository.findOne.mockResolvedValueOnce({ ...mockBill, shipperId: 1 }); // For reloading after save
      repository.save.mockResolvedValue({ ...mockBill, shipperId: 1 });

      const result = await service.accept(1, 1);

      expect(result).toBeDefined();
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException when shipper already has active order', async () => {
      const activeOrder = {
        ...mockBill,
        shipperId: 1,
        status: BillStatusEnum.DELIVERING,
      };
      repository.findOne.mockResolvedValueOnce(activeOrder); // For checking active orders

      await expect(service.accept(1, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when order not found', async () => {
      repository.findOne.mockResolvedValueOnce(null); // For checking active orders
      repository.findOne.mockResolvedValueOnce(null); // For finding the order

      await expect(service.accept(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when order already assigned', async () => {
      const assignedOrder = { ...mockBill, shipperId: 2 };
      repository.findOne.mockResolvedValueOnce(null); // For checking active orders
      repository.findOne.mockResolvedValueOnce(assignedOrder); // For finding the order

      await expect(service.accept(1, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('pickup', () => {
    it('should set order status to DELIVERING', async () => {
      const orderAtChecking = {
        ...mockBill,
        shipperId: 1,
        status: BillStatusEnum.CHECKING,
      };
      repository.findOne.mockResolvedValueOnce(orderAtChecking); // First call
      repository.findOne.mockResolvedValueOnce({
        ...orderAtChecking,
        status: BillStatusEnum.DELIVERING,
      }); // Second call after save
      repository.save.mockResolvedValue({
        ...orderAtChecking,
        status: BillStatusEnum.DELIVERING,
      });

      const result = await service.pickup(1, 1);

      expect(result).toBeDefined();
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when order not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.pickup(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when not shipper of order', async () => {
      const orderWithDifferentShipper = {
        ...mockBill,
        shipperId: 2,
        status: BillStatusEnum.CHECKING,
      };
      repository.findOne.mockResolvedValue(orderWithDifferentShipper);

      await expect(service.pickup(1, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when food is not ready', async () => {
      const orderNotReady = {
        ...mockBill,
        shipperId: 1,
        status: BillStatusEnum.PREPARING,
      };
      repository.findOne.mockResolvedValue(orderNotReady);

      await expect(service.pickup(1, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('deny', () => {
    it('should deny order and remove shipper assignment', async () => {
      const orderAssigned = {
        ...mockBill,
        shipperId: 1,
        status: BillStatusEnum.CHECKING,
      };
      repository.findOne.mockResolvedValueOnce(orderAssigned); // First call
      repository.findOne.mockResolvedValueOnce({
        ...orderAssigned,
        shipperId: null,
      }); // Second call after save
      repository.save.mockResolvedValue({ ...orderAssigned, shipperId: null });

      const result = await service.deny(1, 1);

      expect(result).toBeDefined();
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when order not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.deny(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when not shipper of order', async () => {
      const orderWithDifferentShipper = {
        ...mockBill,
        shipperId: 2,
      };
      repository.findOne.mockResolvedValue(orderWithDifferentShipper);

      await expect(service.deny(1, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when order is being delivered', async () => {
      const orderBeingDelivered = {
        ...mockBill,
        shipperId: 1,
        status: BillStatusEnum.DELIVERING,
      };
      repository.findOne.mockResolvedValue(orderBeingDelivered);

      await expect(service.deny(1, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('delivered', () => {
    it('should mark order as delivered', async () => {
      const orderDelivering = {
        ...mockBill,
        shipperId: 1,
        status: BillStatusEnum.DELIVERING,
      };
      repository.findOne.mockResolvedValueOnce(orderDelivering); // First call
      repository.findOne.mockResolvedValueOnce({
        ...orderDelivering,
        status: BillStatusEnum.DELIVERED,
      }); // Second call after save
      repository.save.mockResolvedValue({
        ...orderDelivering,
        status: BillStatusEnum.DELIVERED,
      });

      const result = await service.delivered(1, 1);

      expect(result).toBeDefined();
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when order not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.delivered(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when not shipper of order', async () => {
      const orderWithDifferentShipper = {
        ...mockBill,
        shipperId: 2,
        status: BillStatusEnum.DELIVERING,
      };
      repository.findOne.mockResolvedValue(orderWithDifferentShipper);

      await expect(service.delivered(1, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when order not being delivered', async () => {
      const orderNotDelivering = {
        ...mockBill,
        shipperId: 1,
        status: BillStatusEnum.CHECKING,
      };
      repository.findOne.mockResolvedValue(orderNotDelivering);

      await expect(service.delivered(1, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
