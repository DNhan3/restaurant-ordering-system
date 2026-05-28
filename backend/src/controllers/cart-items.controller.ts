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
import { CreateCartItemDto } from '../dto/create.dto.js';
import { UpdateCartItemDto } from '../dto/update.dto.js';

@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) { }

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

  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartItemsService.findByUser(userId);
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

  @Delete('user/:userId')
  removeByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartItemsService.removeByUser(userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartItemsService.remove(id);
  }
}
