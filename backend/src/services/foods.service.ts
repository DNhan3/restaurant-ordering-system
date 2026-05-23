import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Food } from '../models/food.entity.js';
import { CreateFoodDto } from '../dto/create-food.dto.js';
import { UpdateFoodDto } from '../dto/update-food.dto.js';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
  ) {}

  async findAll(): Promise<Food[]> {
    return this.foodRepository.find();
  }

  async findOne(id: number): Promise<Food> {
    const food = await this.foodRepository.findOneBy({ id });
    if (!food) {
      throw new NotFoundException(`Food with id ${id} not found`);
    }
    return food;
  }

  async create(createFoodDto: CreateFoodDto): Promise<Food> {
    const food = this.foodRepository.create(createFoodDto);
    return this.foodRepository.save(food);
  }

  async update(id: number, updateFoodDto: UpdateFoodDto): Promise<Food> {
    const food = await this.findOne(id);
    Object.assign(food, updateFoodDto);
    return this.foodRepository.save(food);
  }

  async remove(id: number): Promise<void> {
    const food = await this.findOne(id);
    await this.foodRepository.remove(food);
  }
}
