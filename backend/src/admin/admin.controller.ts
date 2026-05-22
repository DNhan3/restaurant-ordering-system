import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('orders')
  getOrders() {
    return this.adminService.getOrders();
  }

  @Patch('orders/:id')
  updateOrder(@Param('id') id: string, @Body() body: unknown) {
    return this.adminService.updateOrder(id, body);
  }

  @Get('foods')
  getFoods() {
    return this.adminService.getFoods();
  }

  @Post('foods')
  createFood(@Body() body: unknown) {
    return this.adminService.createFood(body);
  }

  @Patch('foods/:id')
  updateFood(@Param('id') id: string, @Body() body: unknown) {
    return this.adminService.updateFood(id, body);
  }
}
