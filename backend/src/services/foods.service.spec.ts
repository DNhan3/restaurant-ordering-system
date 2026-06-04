import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodsService } from './foods.service';
import { Food } from '../models/food.entity';

describe('FoodsService', () => {
  let service: FoodsService;
  let repository: jest.Mocked<Repository<Food>>;

  const mockRepository = () => ({
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  });

  const mockFood = {
    id: 1,
    name: 'Pizza Margherita',
    description: 'Classic pizza',
    price: 10.5,
    category: 'Pizza',
    isActive: true,
    isAvailable: true,
    image: 'pizza.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FoodsService,
        {
          provide: getRepositoryToken(Food),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<FoodsService>(FoodsService);
    repository = module.get<jest.Mocked<Repository<Food>>>(
      getRepositoryToken(Food),
    );
  });

  describe('findAll', () => {
    it('should return all foods mapped to response format', async () => {
      const mockFoods = [mockFood, { ...mockFood, id: 2, name: 'Pasta' }];
      repository.find.mockResolvedValue(mockFoods);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return empty array when no foods exist', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findPaginated', () => {
    const mockQueryBuilder = {
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    };

    beforeEach(() => {
      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);
    });

    it('should return paginated foods with default sort', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockFood], 1]);

      const result = await service.findPaginated({});

      expect(result.items).toHaveLength(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.pageSize).toBe(10);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'food.id',
        'DESC',
      );
    });

    it('should filter by search query', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockFood], 1]);

      await service.findPaginated({ search: 'Pizza' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(LOWER(food.name) LIKE :search OR LOWER(food.description) LIKE :search)',
        expect.objectContaining({
          search: '%pizza%',
        }),
      );
    });

    it('should filter by category', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockFood], 1]);

      await service.findPaginated({ category: 'Pizza' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'food.category = :category',
        { category: 'Pizza' },
      );
    });

    it('should filter by availability', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockFood], 1]);

      await service.findPaginated({ available: 'true' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'food.isAvailable = :available',
        { available: true },
      );
    });

    it('should filter by price range', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockFood], 1]);

      await service.findPaginated({ minPrice: 5, maxPrice: 20 });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'food.price >= :minPrice',
        { minPrice: 5 },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'food.price <= :maxPrice',
        { maxPrice: 20 },
      );
    });

    it('should handle pagination with custom page size', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockFood], 1]);

      const result = await service.findPaginated({ page: 2, pageSize: 20 });

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(20);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
      expect(result.meta.page).toBe(2);
    });

    it('should sort by specified column', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockFood], 1]);

      await service.findPaginated({ sortBy: 'price', sortOrder: 'asc' });

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'food.price',
        'ASC',
      );
    });
  });

  describe('findOne', () => {
    it('should return a single food by id', async () => {
      repository.findOneBy.mockResolvedValue(mockFood);

      const result = await service.findOne(1);

      expect(result).toBeDefined();
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException when food not found', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow();
    });
  });
});
