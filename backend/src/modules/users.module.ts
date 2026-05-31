import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/user.entity.js';
import { UsersService } from '../services/users.service.js';
import { UsersController } from '../controllers/users.controller.js';
import { AuthModule } from './auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
