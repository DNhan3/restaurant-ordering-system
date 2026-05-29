import { Module } from '@nestjs/common';
import { AdminController } from '../controllers/admin.controller.js';
import { AdminService } from '../services/admin.service.js';
import { FoodsModule } from './foods.module.js';
import { UsersModule } from './users.module.js';

@Module({
  imports: [FoodsModule, UsersModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }