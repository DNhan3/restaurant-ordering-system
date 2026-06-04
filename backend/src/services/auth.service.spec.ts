import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { JwtTokenService } from '../auth/jwt-token.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtTokenService: jest.Mocked<JwtTokenService>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword123',
    name: 'Test User',
    isActive: true,
    role: 'customer',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmailOrNull: jest.fn(),
            save: jest.fn(),
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

    service = module.get<AuthService>(AuthService);
    usersService = module.get<jest.Mocked<UsersService>>(UsersService);
    jwtTokenService = module.get<jest.Mocked<JwtTokenService>>(
      JwtTokenService,
    );
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      usersService.findByEmailOrNull.mockResolvedValue(mockUser as any);
      jwtTokenService.sign.mockReturnValue('token123');

      const result = await service.login(loginData);

      expect(result.message).toBe('Login successful');
      expect(result.accessToken).toBe('token123');
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw BadRequestException when email is missing', async () => {
      await expect(
        service.login({ password: 'password123' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when password is missing', async () => {
      await expect(
        service.login({ email: 'test@example.com' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      usersService.findByEmailOrNull.mockResolvedValue(null);

      await expect(
        service.login({ email: 'notfound@example.com', password: 'password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when account is inactive', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      usersService.findByEmailOrNull.mockResolvedValue(inactiveUser as any);

      await expect(
        service.login({ email: 'test@example.com', password: 'password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      usersService.findByEmailOrNull.mockResolvedValue(mockUser as any);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should successfully register new user', async () => {
      const registerData = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'password123',
      };

      usersService.save.mockResolvedValue(mockUser as any);
      jwtTokenService.sign.mockReturnValue('token123');

      const result = await service.register(registerData);

      expect(result.message).toBe('User registered');
      expect(result.accessToken).toBe('token123');
      expect(result.user).toBeDefined();
      expect(usersService.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: registerData.email,
          name: registerData.name,
          password: registerData.password,
        }),
      );
    });

    it('should throw BadRequestException when email is missing', async () => {
      await expect(
        service.register({
          name: 'User',
          password: 'password123',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when name is missing', async () => {
      await expect(
        service.register({
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when password is missing', async () => {
      await expect(
        service.register({
          email: 'test@example.com',
          name: 'User',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should hash password before saving', async () => {
      const registerData = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'password123',
      };

      usersService.save.mockResolvedValue(mockUser as any);
      jwtTokenService.sign.mockReturnValue('token123');

      await service.register(registerData);

      expect(usersService.save).toHaveBeenCalled();
    });
  });
});
