import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHome() {
    return {
      name: 'Restaurant Ordering System API',
      pages: [
        '/',
        '/menu',
        '/cart',
        '/checkout',
        '/orders',
        '/booking',
        '/login',
        '/register',
        '/admin',
        '/admin/orders',
        '/admin/foods',
      ],
    };
  }
}
