import { Controller, Get, Param } from '@nestjs/common';
import { FoodsService } from './foods.service';

@Controller()
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Get('menu')
  getMenu() {
    return this.foodsService.findAll();
  }

  @Get('foods/:id')
  getFood(@Param('id') id: string) {
    return this.foodsService.findOne(id);
  }
}
