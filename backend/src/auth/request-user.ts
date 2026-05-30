import { ForbiddenException } from '@nestjs/common';
import type { AuthUser } from './auth.types.js';

export const assertSelfOrAdmin = (user: AuthUser, resourceUserId: number) => {
  if (user.role === 'admin' || user.sub === resourceUserId) {
    return;
  }

  throw new ForbiddenException('You can only access your own resources');
};

