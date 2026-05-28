import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity.js';
import { CreateUserDto } from '../dto/create.dto.js';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findByEmailOrNull(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findByName(name: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ name });
    if (!user) {
      throw new NotFoundException(`User with name ${name} not found`);
    }
    return user;
  }

  async save(createUserDto: CreateUserDto): Promise<User> {
    const existingByEmail = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingByEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingByName = await this.userRepository.findOneBy({
      name: createUserDto.name,
    });
    if (existingByName) {
      throw new ConflictException('Name already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async findByRole(role: string): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.findBy({ role });
    return users.map(({ password: _pw, ...rest }) => rest as Omit<User, 'password'>);
  }
}
