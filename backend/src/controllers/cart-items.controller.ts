import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';
import { CartItemsService } from '../services/cart-items.service.js';
import { CreateCartItemDto } from '../dto/create.dto.js';
import { UpdateCartItemDto } from '../dto/update.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { assertSelfOrAdmin } from '../auth/request-user.js';
import type { AuthUser } from '../auth/auth.types.js';

@Controller('cart-items')
@UseGuards(JwtAuthGuard)
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  create(
    @Body() createCartItemDto: CreateCartItemDto,
    @Req() request: Request & { user: AuthUser },
  ) {
    assertSelfOrAdmin(request.user, createCartItemDto.userId);
    return this.cartItemsService.create(createCartItemDto);
  }

  @Get('user/:userId/food/:foodId')
  findByUserAndFood(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('foodId', ParseIntPipe) foodId: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    assertSelfOrAdmin(request.user, userId);
    return this.cartItemsService.findByUserAndFood(userId, foodId);
  }

  @Get('user/:userId')
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    assertSelfOrAdmin(request.user, userId);
    return this.cartItemsService.findByUser(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    const item = await this.cartItemsService.findOne(id);
    if (!item) {
      throw new NotFoundException(`Cart item with id ${id} not found`);
    }
    assertSelfOrAdmin(request.user, item.user_id);
    return item;
  }

  @Put()
  async update(
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Req() request: Request & { user: AuthUser },
  ) {
    if (updateCartItemDto.userId) {
      assertSelfOrAdmin(request.user, updateCartItemDto.userId);
    } else if (updateCartItemDto.id) {
      const item = await this.cartItemsService.findOne(updateCartItemDto.id);
      if (!item) {
        throw new NotFoundException(
          `Cart item with id ${updateCartItemDto.id} not found`,
        );
      }
      assertSelfOrAdmin(request.user, item.user_id);
    }
    return this.cartItemsService.update(updateCartItemDto);
  }

  @Delete('user/:userId/food/:foodId')
  removeByUserAndFood(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('foodId', ParseIntPipe) foodId: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    assertSelfOrAdmin(request.user, userId);
    return this.cartItemsService.removeByUserAndFood(userId, foodId);
  }

  @Delete('user/:userId')
  removeByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    assertSelfOrAdmin(request.user, userId);
    return this.cartItemsService.removeByUser(userId);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    const item = await this.cartItemsService.findOne(id);
    if (!item) {
      throw new NotFoundException(`Cart item with id ${id} not found`);
    }
    assertSelfOrAdmin(request.user, item.user_id);
    return this.cartItemsService.remove(id);
  }
}
