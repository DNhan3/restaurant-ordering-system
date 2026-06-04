import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminService } from './admin.service';
import { FoodsService } from './foods.service';
import { UsersService } from './users.service';
import { JwtTokenService } from '../auth/jwt-token.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AdminService', () => {
  let service: AdminService;
  let configService: jest.Mocked<ConfigService>;
  let foodsService: jest.Mocked<FoodsService>;
  let usersService: jest.Mocked<UsersService>;
  let jwtTokenService: jest.Mocked<JwtTokenService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: FoodsService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: JwtTokenService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    configService = module.get<jest.Mocked<ConfigService>>(ConfigService);
    foodsService = module.get<jest.Mocked<FoodsService>>(FoodsService);
    usersService = module.get<jest.Mocked<UsersService>>(UsersService);
    jwtTokenService = module.get<jest.Mocked<JwtTokenService>>(
      JwtTokenService,
    );
  });

  describe('login', () => {
    it('should successfully login with valid password hash', async () => {
      const testPassword = 'adminpass';
      const hashedPassword = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36XQuvKm'; // bcrypt hash example
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      configService.get.mockReturnValue(hashedPassword);
      jwtTokenService.sign.mockReturnValue('admin_token_123');

      const result = await service.login({ password: testPassword });

      expect(result.message).toBe('Admin login successful');
      expect(result.admin.role).toBe('admin');
      expect(result.accessToken).toBe('admin_token_123');
      expect(bcrypt.compare).toHaveBeenCalledWith(testPassword, hashedPassword);
    });

    it('should throw BadRequestException when password is missing', async () => {
      await expect(service.login({})).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when admin password not configured', async () => {
      configService.get.mockReturnValue(null);

      await expect(
        service.login({ password: 'somepass' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException with invalid password', async () => {
      const testPassword = 'wrongpass';
      const hashedPassword = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36XQuvKm';
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      configService.get.mockReturnValue(hashedPassword);

      await expect(
        service.login({ password: testPassword }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return admin object with correct properties', async () => {
      const testPassword = 'adminpass';
      const hashedPassword = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36XQuvKm';
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      configService.get.mockReturnValue(hashedPassword);
      jwtTokenService.sign.mockReturnValue('token');

      const result = await service.login({ password: testPassword });

      expect(result.admin).toEqual({
        sub: 0,
        id: 0,
        email: 'admin@qfood.local',
        name: 'Administrator',
        role: 'admin',
      });
    });
  });

  describe('getDashboard', () => {
    it('should return dashboard ready message', () => {
      const result = service.getDashboard();

      expect(result.message).toBe('Admin dashboard endpoint ready');
    });
  });

  describe('getOrders', () => {
    it('should return orders endpoint ready message', () => {
      const result = service.getOrders();

      expect(result.message).toBe('Manage orders endpoint ready');
      expect(result.items).toEqual([]);
      expect(Array.isArray(result.items)).toBe(true);
    });
  });

  describe('updateOrder', () => {
    it('should return update order message with id and data', () => {
      const orderData = { status: 'preparing' };
      const result = service.updateOrder('123', orderData);

      expect(result.message).toBe('Update order endpoint ready');
      expect(result.id).toBe('123');
      expect(result.data).toEqual(orderData);
    });

    it('should preserve order id in response', () => {
      const result = service.updateOrder('456', {});

      expect(result.id).toBe('456');
    });
  });
});
