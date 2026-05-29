import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from '../dto/create.dto.js';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) { }

  async login(body: unknown) {
    const { email, password } = body as Partial<CreateUserDto>;
    if (!email || !password) {
      throw new BadRequestException('email and password are required');
    }

    const user = await this.usersService.findByEmailOrNull(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _pw, ...rest } = user as any;
    return { message: 'Login successful', user: rest };
  }

  async register(body: unknown) {
    const { email, name, password } = body as Partial<CreateUserDto>;
    if (!email || !name || !password) {
      throw new BadRequestException('email, name and password are required');
    }
    const createUserDto: CreateUserDto = { email, name, password };
    const user = await this.usersService.save(createUserDto);
    const { password: _pw, ...rest } = user as any;
    return { message: 'User registered', user: rest };
  }
}