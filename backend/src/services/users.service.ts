import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
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

  async deleteByIdAndRole(id: number, role: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOneBy({ id, role });

    if (!user) {
      throw new NotFoundException(`${role} with id ${id} not found`);
    }

    await this.userRepository.remove(user);
    const { password: _pw, ...rest } = user;

    return rest as Omit<User, 'password'>;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async updateProfile(id: number, data: { name?: string; phone?: string }): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    if (data.name !== undefined) user.name = data.name;
    if (data.phone !== undefined) user.phone = data.phone;
    const saved = await this.userRepository.save(user);
    const { password: _pw, ...rest } = saved;
    return rest as Omit<User, 'password'>;
  }

  async changePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await this.userRepository.save(user);
  }
}
