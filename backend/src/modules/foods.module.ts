import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from '../models/food.entity.js';
import { FoodsService } from '../services/foods.service.js';
import { FoodsController } from '../controllers/foods.controller.js';
import { AuthModule } from './auth.module.js';
import { AuditLogsModule } from './audit-logs.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Food]), AuthModule, AuditLogsModule],
  controllers: [FoodsController],
  providers: [FoodsService],
  exports: [FoodsService],
})
export class FoodsModule {}
