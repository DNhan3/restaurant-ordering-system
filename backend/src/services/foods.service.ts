import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Food } from '../models/food.entity.js';
import { CreateFoodDto } from '../dto/create.dto.js';
import { UpdateFoodDto } from '../dto/update.dto.js';
import { mapFoodResponse } from './response-mappers.js';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
  ) { }

  async findAll() {
    const foods = await this.foodRepository.find();
    return foods.map(mapFoodResponse);
  }

  async findOne(id: number) {
    return mapFoodResponse(await this.findEntity(id));
  }

  async create(createFoodDto: CreateFoodDto) {
    const food = this.foodRepository.create(createFoodDto);
    return mapFoodResponse(await this.foodRepository.save(food));
  }

  async update(id: number, updateFoodDto: UpdateFoodDto) {
    const food = await this.findEntity(id);
    Object.assign(food, updateFoodDto);
    return mapFoodResponse(await this.foodRepository.save(food));
  }

  async remove(id: number): Promise<void> {
    const food = await this.findEntity(id);
    await this.foodRepository.remove(food);
  }

  private async findEntity(id: number): Promise<Food> {
    const food = await this.foodRepository.findOneBy({ id });
    if (!food) {
      throw new NotFoundException(`Food with id ${id} not found`);
    }
    return food;
  }
}