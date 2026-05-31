import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service.js';
import { CreateUserDto } from '../dto/create.dto.js';
import { UpdateUserDto } from '../dto/update.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { AuthUser } from '../auth/auth.types.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

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
    @Body() body: { name?: string },
    @Req() request: Request & { user: AuthUser },
  ) {
    if (request.user.sub !== id) {
      throw new UnauthorizedException('You can only update your own profile');
    }
    const updated = await this.usersService.updateProfile(id, {
      name: body.name,
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

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createByAdmin(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.save({
      email: createUserDto.email,
      name: createUserDto.name,
      password: createUserDto.password,
      role: createUserDto.role ?? 'customer',
    });
    const { password: _pw, ...rest } = user as any;
    return rest;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
