import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../services/users.service.js';
import { CreateUserDto } from '../dto/create.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
}
