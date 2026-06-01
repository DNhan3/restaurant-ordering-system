import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/user.entity.js';
import { UsersService } from '../services/users.service.js';
import { UsersController } from '../controllers/users.controller.js';
import { AuthModule } from './auth.module.js';
import { JwtTokenService } from '../auth/jwt-token.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { AuditLogsModule } from './audit-logs.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule), AuditLogsModule],
  controllers: [UsersController],
  providers: [UsersService, JwtTokenService, JwtAuthGuard, RolesGuard],
  exports: [UsersService],
})
export class UsersModule {}
