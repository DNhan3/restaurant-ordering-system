import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity.js';
import { CreateUserDto } from '../dto/create.dto.js';
import { UpdateUserDto } from '../dto/update.dto.js';
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

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find({
      order: { id: 'ASC' },
    });
    return users.map((user) => this.withoutPassword(user));
  }

  async findOne(id: number): Promise<Omit<User, 'password'>> {
    return this.withoutPassword(await this.findEntity(id));
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.findEntity(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingByEmail = await this.userRepository.findOneBy({
        email: updateUserDto.email,
      });
      if (existingByEmail) {
        throw new ConflictException('Email already exists');
      }
      user.email = updateUserDto.email;
    }

    if (updateUserDto.name && updateUserDto.name !== user.name) {
      const existingByName = await this.userRepository.findOneBy({
        name: updateUserDto.name,
      });
      if (existingByName) {
        throw new ConflictException('Name already exists');
      }
      user.name = updateUserDto.name;
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.role) {
      user.role = updateUserDto.role;
    }

    return this.withoutPassword(await this.userRepository.save(user));
  }

  async remove(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.findEntity(id);
    await this.userRepository.remove(user);
    return this.withoutPassword(user);
  }

  async findByRole(role: string): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.findBy({ role });
    return users.map((user) => this.withoutPassword(user));
  }

  async deleteByIdAndRole(id: number, role: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOneBy({ id, role });

    if (!user) {
      throw new NotFoundException(`${role} with id ${id} not found`);
    }

    await this.userRepository.remove(user);
    return this.withoutPassword(user);
  }

  private async findEntity(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  private withoutPassword(user: User): Omit<User, 'password'> {
    const { password: _pw, ...rest } = user;
    return rest as Omit<User, 'password'>;
  }
}
