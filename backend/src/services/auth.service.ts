import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from '../dto/create.dto.js';
import * as bcrypt from 'bcryptjs';
import { JwtTokenService } from '../auth/jwt-token.service.js';
import type { AuthUser } from '../auth/auth.types.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtTokenService: JwtTokenService,
  ) { }

  async login(body: unknown) {
    const { email, password } = body as Partial<CreateUserDto>;
    if (!email || !password) {
      throw new BadRequestException('email and password are required');
    }

    const user = await this.usersService.findByEmailOrNull(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isActive === false) {
      throw new UnauthorizedException('Account is inactive');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      message: 'Login successful',
      user: this.toAuthUser(user),
      accessToken: this.jwtTokenService.sign(this.toAuthUser(user)),
    };
  }

  async register(body: unknown) {
    const { email, name, password } = body as Partial<CreateUserDto>;
    if (!email || !name || !password) {
      throw new BadRequestException('email, name and password are required');
    }
    const createUserDto: CreateUserDto = { email, name, password };
    const user = await this.usersService.save(createUserDto);
    const authUser = this.toAuthUser(user);
    return {
      message: 'User registered',
      user: authUser,
      accessToken: this.jwtTokenService.sign(authUser),
    };
  }

  private toAuthUser(user: { id: number; email: string; name: string; role: string; phone?: string }): AuthUser {
    const role = user.role === 'shipper' ? 'shipper' : 'customer';
    return {
      sub: user.id,
      id: user.id,
      email: user.email,
      name: user.name,
      role,
      phone: user.phone,
    };
  }
}
