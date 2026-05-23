import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from '../models/cart-item.entity.js';
import { CartItemsService } from '../services/cart-items.service.js';
import { CartItemsController } from '../controllers/cart-items.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem])],
  controllers: [CartItemsController],
  providers: [CartItemsService],
  exports: [CartItemsService],
})
export class CartItemsModule {}
