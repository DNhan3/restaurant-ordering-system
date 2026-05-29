import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { FoodsService } from './foods.service.js';
import { CreateFoodDto } from '../dto/create-food.dto.js';
import { UpdateFoodDto } from '../dto/update-food.dto.js';

@Injectable()
export class AdminService {
  constructor(
    private readonly configService: ConfigService,
    private readonly foodsService: FoodsService,
  ) {}

  async login(body: unknown) {
    const { password } = body as { password?: string };

    if (!password) {
      throw new BadRequestException('password is required');
    }

    const passwordplain = this.configService.get<string>('ADMIN_PASSWORD');
    const passwordHash = bcrypt.hashSync(passwordplain, 10);
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
}
