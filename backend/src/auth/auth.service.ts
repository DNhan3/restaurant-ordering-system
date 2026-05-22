import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(body: unknown) {
    return {
      message: 'Login endpoint ready',
      data: body,
    };
  }

  register(body: unknown) {
    return {
      message: 'Register endpoint ready',
      data: body,
    };
  }
}
