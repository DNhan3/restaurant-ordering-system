import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from '../models/cart-item.entity.js';
import { CreateCartItemDto } from '../dto/create-cart-item.dto.js';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto.js';
import { mapCartItemResponse } from './response-mappers.js';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async create(createCartItemDto: CreateCartItemDto) {
    const cartItem = this.cartItemRepository.create(createCartItemDto);
    const saved = await this.cartItemRepository.save(cartItem);
    return mapCartItemResponse(await this.findEntity(saved.id));
  }

  async findByUserAndFood(userId: number, foodId: number) {
    return mapCartItemResponse(await this.findEntityByUserAndFood(userId, foodId));
  }

  async findByUser(userId: number) {
    const cartItems = await this.cartItemRepository.find({
      where: { userId },
      relations: { user: true, food: true },
    });
    return cartItems.map(mapCartItemResponse);
  }

  async findOne(id: number) {
    return mapCartItemResponse(await this.findEntity(id));
  }

  async update(updateCartItemDto: UpdateCartItemDto) {
    const { id, userId, foodId, ...updateData } = updateCartItemDto;

    let cartItem: CartItem;
    if (id) {
      cartItem = await this.findEntity(id);
    } else if (userId && foodId) {
      cartItem = await this.findEntityByUserAndFood(userId, foodId);
    } else {
      throw new NotFoundException(
        'Must provide either id or userId+foodId to update',
      );
    }

    Object.assign(cartItem, updateData);
    const saved = await this.cartItemRepository.save(cartItem);
    return mapCartItemResponse(await this.findEntity(saved.id));
  }

  async removeByUserAndFood(userId: number, foodId: number): Promise<void> {
    const cartItem = await this.findEntityByUserAndFood(userId, foodId);
    await this.cartItemRepository.remove(cartItem);
  }

  async removeByUser(userId: number): Promise<void> {
    await this.cartItemRepository.delete({ userId });
  }

  async remove(id: number): Promise<void> {
    const cartItem = await this.findEntity(id);
    await this.cartItemRepository.remove(cartItem);
  }

  private async findEntityByUserAndFood(
    userId: number,
    foodId: number,
  ): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { userId, foodId },
      relations: { user: true, food: true },
    });
    if (!cartItem) {
      throw new NotFoundException(
        `Cart item for user ${userId} and food ${foodId} not found`,
      );
    }
    return cartItem;
  }

  private async findEntity(id: number): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id },
      relations: { user: true, food: true },
    });
    if (!cartItem) {
      throw new NotFoundException(`Cart item with id ${id} not found`);
    }
    return cartItem;
  }
}
