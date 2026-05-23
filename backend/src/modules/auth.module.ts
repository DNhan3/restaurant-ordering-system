import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller.js';
import { AuthService } from '../services/auth.service.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
