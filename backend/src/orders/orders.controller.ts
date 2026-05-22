import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(@Body() body: unknown) {
    return this.ordersService.checkout(body);
  }

  @Get('orders')
  getOrders() {
    return this.ordersService.findCustomerOrders();
  }

  @Get('orders/:id')
  getOrder(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
