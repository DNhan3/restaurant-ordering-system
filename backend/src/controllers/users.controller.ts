import { Controller, Post, Put, Body, Param, ParseIntPipe, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from '../services/users.service.js';
import { CreateUserDto } from '../dto/create.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import type { AuthUser } from '../auth/auth.types.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('find')
  findByEmail() {
    throw new UnauthorizedException('User lookup requires authentication');
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.save({
      email: createUserDto.email,
      name: createUserDto.name,
      password: createUserDto.password,
      role: 'customer',
    });
    const { password: _pw, ...rest } = user as any;
    return rest;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string; phone?: string },
    @Req() request: Request & { user: AuthUser },
  ) {
    if (request.user.sub !== id) {
      throw new UnauthorizedException('You can only update your own profile');
    }
    const updated = await this.usersService.updateProfile(id, {
      name: body.name,
      phone: body.phone,
    });
    return { user: updated };
  }

  @Put(':id/password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { currentPassword: string; newPassword: string },
    @Req() request: Request & { user: AuthUser },
  ) {
    if (request.user.sub !== id) {
      throw new UnauthorizedException('You can only change your own password');
    }
    await this.usersService.changePassword(id, body.currentPassword, body.newPassword);
    return { message: 'Password changed successfully' };
  }
}
