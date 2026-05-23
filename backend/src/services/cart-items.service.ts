import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from '../models/cart-item.entity.js';
import { CreateCartItemDto } from '../dto/create-cart-item.dto.js';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto.js';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async create(createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    const cartItem = this.cartItemRepository.create(createCartItemDto);
    return this.cartItemRepository.save(cartItem);
  }

  async findByUserAndFood(userId: number, foodId: number): Promise<CartItem> {
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

  async findOne(id: number): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id },
      relations: { user: true, food: true },
    });
    if (!cartItem) {
      throw new NotFoundException(`Cart item with id ${id} not found`);
    }
    return cartItem;
  }

  async update(updateCartItemDto: UpdateCartItemDto): Promise<CartItem> {
    const { id, userId, foodId, ...updateData } = updateCartItemDto;

    let cartItem: CartItem;
    if (id) {
      cartItem = await this.findOne(id);
    } else if (userId && foodId) {
      cartItem = await this.findByUserAndFood(userId, foodId);
    } else {
      throw new NotFoundException(
        'Must provide either id or userId+foodId to update',
      );
    }

    Object.assign(cartItem, updateData);
    return this.cartItemRepository.save(cartItem);
  }

  async removeByUserAndFood(userId: number, foodId: number): Promise<void> {
    const cartItem = await this.findByUserAndFood(userId, foodId);
    await this.cartItemRepository.remove(cartItem);
  }

  async remove(id: number): Promise<void> {
    const cartItem = await this.findOne(id);
    await this.cartItemRepository.remove(cartItem);
  }
}
