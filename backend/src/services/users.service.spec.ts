import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service';

describe('UsersService', () => {
  const createRepository = () => ({
    findOneBy: jest.fn(),
    create: jest.fn((user) => user),
    save: jest.fn(async (user) => ({ id: 1, ...user })),
  });

  it('hashes passwords before saving a user', async () => {
    const repository = createRepository();
    repository.findOneBy.mockResolvedValue(null);
    const service = new UsersService(repository as any);

    const user = await service.save({
      email: 'guest@example.com',
      name: 'Guest',
      password: 'Secret123!',
    });

    expect(user.password).not.toBe('Secret123!');
    await expect(bcrypt.compare('Secret123!', user.password)).resolves.toBe(
      true,
    );
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'guest@example.com',
        name: 'Guest',
      }),
    );
  });

  it('rejects duplicate emails before hashing and saving', async () => {
    const repository = createRepository();
    repository.findOneBy.mockResolvedValueOnce({ id: 1 });
    const service = new UsersService(repository as any);

    await expect(
      service.save({
        email: 'guest@example.com',
        name: 'Guest',
        password: 'Secret123!',
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(repository.create).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });
});
