import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../services/auth.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import type { AuthUser } from '../auth/auth.types.js';
import { UsersService } from '../services/users.service.js';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  login(@Body() body: unknown) {
    return this.authService.login(body);
  }

  @Post('register')
  register(@Body() body: unknown) {
    return this.authService.register(body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() request: Request & { user: AuthUser }) {
    const user = await this.usersService.findById(request.user.sub);
    const { password: _pw, ...rest } = user as any;
    return { user: rest };
  }
}
