import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UsersService } from '../services/users.service.js';
import { CreateUserDto } from '../dto/create.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('find')
  async findByEmail(@Body('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    const { password: _pw, ...rest } = user as any;
    return rest;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.save(createUserDto);
    const { password: _pw, ...rest } = user as any;
    return rest;
  }
}