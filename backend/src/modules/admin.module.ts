import { Module } from '@nestjs/common';
import { AdminController } from '../controllers/admin.controller.js';
import { AdminService } from '../services/admin.service.js';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
