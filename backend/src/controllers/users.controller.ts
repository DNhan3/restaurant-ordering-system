import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service.js';
import { CreateUserDto } from '../dto/create.dto.js';
import { UpdateUserDto } from '../dto/update.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import type { AuthUser } from '../auth/auth.types.js';
import { hasListQuery } from '../services/query-options.js';
import type { ListQueryOptions } from '../services/query-options.js';
import { AuditLogsService } from '../services/audit-logs.service.js';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly auditLogsService: AuditLogsService,
  ) { }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll(@Query() query: ListQueryOptions) {
    return hasListQuery(query)
      ? this.usersService.findPaginated(query)
      : this.usersService.findAll();
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
  async createByAdmin(
    @Body() createUserDto: CreateUserDto,
    @Req() request: Request & { user: AuthUser },
  ) {
    const user = await this.usersService.save({
      email: createUserDto.email,
      name: createUserDto.name,
      password: createUserDto.password,
      role: createUserDto.role ?? 'customer',
    });
    const { password: _pw, ...rest } = user as any;
    await this.auditLogsService.record({
      actor: request.user,
      action: 'create',
      entityType: 'user',
      entityId: user.id,
      metadata: { email: user.email, role: user.role },
    });
    return rest;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request & { user: AuthUser },
  ) {
    return this.usersService.update(id, updateUserDto).then(async (user) => {
      await this.auditLogsService.record({
        actor: request.user,
        action: 'update',
        entityType: 'user',
        entityId: id,
        metadata: {
          changedFields: Object.keys(updateUserDto).filter((key) => key !== 'password'),
          passwordChanged: Boolean(updateUserDto.password),
        },
      });
      return user;
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request & { user: AuthUser },
  ) {
    const user = await this.usersService.remove(id);
    await this.auditLogsService.record({
      actor: request.user,
      action: 'delete',
      entityType: 'user',
      entityId: id,
      metadata: { email: user.email, role: user.role },
    });
    return user;
  }
}
