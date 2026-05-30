import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillStatus } from '../models/bill-status.entity.js';
import { User } from '../models/user.entity.js';
import { ShipperService } from '../services/shipper.service.js';
import { ShipperController } from '../controllers/shipper.controller.js';
import { AuthModule } from './auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([BillStatus, User]), AuthModule],
  controllers: [ShipperController],
  providers: [ShipperService],
  exports: [ShipperService],
})
export class ShipperModule { }
