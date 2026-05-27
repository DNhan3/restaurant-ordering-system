import { Module } from '@nestjs/common';
import { AdminController } from '../controllers/admin.controller.js';
import { AdminService } from '../services/admin.service.js';
import { FoodsModule } from './foods.module.js';

@Module({
  imports: [FoodsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
