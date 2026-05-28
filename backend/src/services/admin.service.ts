import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { FoodsService } from './foods.service.js';
import { UsersService } from './users.service.js';
import { CreateFoodDto } from '../dto/create.dto.js';
import { UpdateFoodDto } from '../dto/update.dto.js';
import { CreateUserDto } from '../dto/create.dto.js';

@Injectable()
export class AdminService {
  constructor(
    private readonly configService: ConfigService,
    private readonly foodsService: FoodsService,
    private readonly usersService: UsersService,
  ) { }

  async login(body: unknown) {
    const { password } = body as { password?: string };

    if (!password) {
      throw new BadRequestException('password is required');
    }

    const passwordHash = this.configService.get<string>('ADMIN_PASSWORD_HASH');
    let isValid = false;

    if (passwordHash) {
      isValid = await bcrypt.compare(password, passwordHash);
    } else {
      throw new BadRequestException('Admin password is not configured');
    }

    if (!isValid) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    return {
      message: 'Admin login successful',
      admin: {
        role: 'admin',
        name: 'Administrator',
      },
    };
  }

  getDashboard() {
    return {
      message: 'Admin dashboard endpoint ready',
    };
  }

  getOrders() {
    return {
      message: 'Manage orders endpoint ready',
      items: [],
    };
  }

  updateOrder(id: string, body: unknown) {
    return {
      message: 'Update order endpoint ready',
      id,
      data: body,
    };
  }

  getFoods() {
    return this.foodsService.findAll();
  }

  createFood(body: CreateFoodDto) {
    return this.foodsService.create(body);
  }

  updateFood(id: string, body: UpdateFoodDto) {
    return this.foodsService.update(Number(id), body);
  }

  async createShipper(body: { email: string; name: string; password: string }) {
    if (!body.email || !body.name || !body.password) {
      throw new BadRequestException('email, name and password are required');
    }
    const dto: CreateUserDto = {
      email: body.email,
      name: body.name,
      password: body.password,
      role: 'shipper',
    };
    const user = await this.usersService.save(dto);
    const { password: _pw, ...rest } = user as any;
    return { message: 'Shipper account created', shipper: rest };
  }

  async getShippers() {
    return this.usersService.findByRole('shipper');
  }
}

