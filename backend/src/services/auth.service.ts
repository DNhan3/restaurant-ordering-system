import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service.js';
import { CreateUserDto } from '../dto/create.dto.js';
import * as bcrypt from 'bcryptjs';
import { JwtTokenService } from '../auth/jwt-token.service.js';
import type { AuthUser, UserRole } from '../auth/auth.types.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly configService: ConfigService,
  ) {}

  async login(body: unknown) {
    const { email, password } = body as Partial<CreateUserDto>;
    if (!email || !password) {
      throw new BadRequestException('email and password are required');
    }

    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPasswordHash = this.configService.get<string>(
      'ADMIN_PASSWORD_HASH',
    );

    if (adminEmail && email === adminEmail) {
      return this.loginAsAdmin(email, password, adminPasswordHash);
    }

    return this.loginAsUser(email, password);
  }

  private async loginAsAdmin(
    email: string,
    password: string,
    passwordHash: string | undefined,
  ) {
    if (!passwordHash) {
      throw new BadRequestException('Admin login is not configured');
    }

    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user: AuthUser = {
      sub: 0,
      id: 0,
      email,
      name: 'Administrator',
      role: 'admin',
    };

    return {
      message: 'Login successful',
      user,
      accessToken: this.jwtTokenService.sign(user),
    };
  }

  private async loginAsUser(email: string, password: string) {
    const user = await this.usersService.findByEmailOrNull(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validRoles: UserRole[] = ['customer', 'shipper'];
    const role: UserRole = validRoles.includes(user.role as UserRole)
      ? (user.role as UserRole)
      : 'customer';

    const authUser: AuthUser = {
      sub: user.id,
      id: user.id,
      email: user.email,
      name: user.name,
      role,
    };

    return {
      message: 'Login successful',
      user: authUser,
      accessToken: this.jwtTokenService.sign(authUser),
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

  private toAuthUser(user: {
    id: number;
    email: string;
    name: string;
    role: string;
  }): AuthUser {
    const validRoles: UserRole[] = ['customer', 'shipper'];
    const role: UserRole = validRoles.includes(user.role as UserRole)
      ? (user.role as UserRole)
      : 'customer';
    return {
      sub: user.id,
      id: user.id,
      email: user.email,
      name: user.name,
      role,
    };
  }
}
