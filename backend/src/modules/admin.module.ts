import { Module } from '@nestjs/common';
import { AdminController } from '../controllers/admin.controller.js';
import { AdminService } from '../services/admin.service.js';
import { FoodsModule } from './foods.module.js';
import { UsersModule } from './users.module.js';
import { AuthModule } from './auth.module.js';
import { AuditLogsModule } from './audit-logs.module.js';

@Module({
  imports: [FoodsModule, UsersModule, AuthModule, AuditLogsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }
