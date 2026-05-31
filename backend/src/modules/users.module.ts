import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/user.entity.js';
import { UsersService } from '../services/users.service.js';
import { UsersController } from '../controllers/users.controller.js';
import { JwtTokenService } from '../auth/jwt-token.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, JwtTokenService, JwtAuthGuard, RolesGuard],
  exports: [UsersService],
})
export class UsersModule {}
