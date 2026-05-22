import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingsService {
  findCustomerBookings() {
    return {
      message: 'Table booking history endpoint ready',
      items: [],
    };
  }

  create(body: unknown) {
    return {
      message: 'Create table booking endpoint ready',
      data: body,
    };
  }
}
