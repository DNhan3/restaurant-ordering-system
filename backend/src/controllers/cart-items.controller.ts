import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CartItemsService } from '../services/cart-items.service.js';
import { CreateCartItemDto } from '../dto/create-cart-item.dto.js';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto.js';

@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  create(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemsService.create(createCartItemDto);
  }

  @Get('user/:userId/food/:foodId')
  findByUserAndFood(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('foodId', ParseIntPipe) foodId: number,
  ) {
    return this.cartItemsService.findByUserAndFood(userId, foodId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cartItemsService.findOne(id);
  }

  @Put()
  update(@Body() updateCartItemDto: UpdateCartItemDto) {
    return this.cartItemsService.update(updateCartItemDto);
  }

  @Delete('user/:userId/food/:foodId')
  removeByUserAndFood(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('foodId', ParseIntPipe) foodId: number,
  ) {
    return this.cartItemsService.removeByUserAndFood(userId, foodId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartItemsService.remove(id);
  }
}
