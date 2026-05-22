import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getProfile() {
    return {
      message: 'User profile endpoint ready',
    };
  }
}
