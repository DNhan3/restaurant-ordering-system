import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Food } from '../models/food.entity.js';
import { CreateFoodDto } from '../dto/create.dto.js';
import { UpdateFoodDto } from '../dto/update.dto.js';
import { mapFoodResponse } from './response-mappers.js';
import {
  buildPaginationMeta,
  getPagination,
  getSortOrder,
  ListQueryOptions,
} from './query-options.js';

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

  async findPaginated(query: ListQueryOptions) {
    const { page, pageSize, skip, take } = getPagination(query);
    const sortColumns: Record<string, string> = {
      id: 'food.id',
      name: 'food.name',
      price: 'food.price',
      category: 'food.category',
      createdAt: 'food.createdAt',
      updatedAt: 'food.updatedAt',
    };
    const sortColumn = sortColumns[String(query.sortBy || 'id')] ?? sortColumns.id;

    const qb = this.foodRepository.createQueryBuilder('food');

    if (query.search) {
      qb.andWhere(
        '(LOWER(food.name) LIKE :search OR LOWER(food.description) LIKE :search)',
        { search: `%${String(query.search).toLowerCase()}%` },
      );
    }

    if (query.category && query.category !== 'all') {
      qb.andWhere('food.category = :category', { category: query.category });
    }

    if (query.available !== undefined && query.available !== 'all') {
      qb.andWhere('food.isAvailable = :available', {
        available: String(query.available) === 'true',
      });
    }

    if (query.minPrice !== undefined && query.minPrice !== '') {
      qb.andWhere('food.price >= :minPrice', { minPrice: Number(query.minPrice) });
    }

    if (query.maxPrice !== undefined && query.maxPrice !== '') {
      qb.andWhere('food.price <= :maxPrice', { maxPrice: Number(query.maxPrice) });
    }

    const [foods, total] = await qb
      .orderBy(sortColumn, getSortOrder(query.sortOrder))
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      items: foods.map(mapFoodResponse),
      meta: buildPaginationMeta(page, pageSize, total),
    };
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
    food.isActive = false;
    await this.foodRepository.save(food);
    await this.foodRepository.softRemove(food);
  }

  private async findEntity(id: number): Promise<Food> {
    const food = await this.foodRepository.findOneBy({ id });
    if (!food) {
      throw new NotFoundException(`Food with id ${id} not found`);
    }
    return food;
  }
}
