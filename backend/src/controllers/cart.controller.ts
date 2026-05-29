import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CartService } from '../services/cart.service.js';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get()
  getCart() {
    return this.cartService.getCart();
  }

  @Post('items')
  addItem(@Body() body: unknown) {
    return this.cartService.addItem(body);
  }

  @Patch('items/:id')
  updateItem(@Param('id') id: string, @Body() body: unknown) {
    return this.cartService.updateItem(id, body);
  }

  @Delete('items/:id')
  removeItem(@Param('id') id: string) {
    return this.cartService.removeItem(id);
  }
}